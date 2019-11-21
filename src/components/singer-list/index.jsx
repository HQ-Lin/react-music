import React from 'react';
import './style.scss';

import classnames from 'classnames';
import Scroll from '@components/scroll';
import Loading from '@components/loading';
import { getData } from '@assets/utils/dom';
import { observer, inject } from 'mobx-react';

const TITLE_HEIGHT = 30;
const ANCHOR_HEIGHT = 18;

@inject('playerStore')
@observer
class SingerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
        };
        this.onScroll = this.onScroll.bind(this);
        this.onShotCutTouchStart = this.onShotCutTouchStart.bind(this);
        this.onShortcutTouchMove = this.onShortcutTouchMove.bind(this);
        this.touch = {};
        this.listHeight = [];
        this.listGroup = [];
    }

    get shortcutList() {
        return this.props.data.map((group) => group.title.substr(0, 1));
    }

    get fixedTitle() {
        return this.props.data[this.state.currentIndex] ? this.props.data[this.state.currentIndex].title : '';
    }

    set scrollY(newY) {
        const listHeight = this.listHeight;
        const leng = listHeight.length;
        if (newY > 0) {
            return this.state.currentIndex !== 0 ? this.setState({ currentIndex: 0 }) : null;
        }
        for (let i = 0;i < leng - 1;i++) {
            let height1 = listHeight[i];
            let height2 = listHeight[i + 1];
            if (-newY >= height1 && -newY < height2) {
                this.diff = height2 + newY;
                return this.state.currentIndex !== i ? this.setState({ currentIndex: i }) : null;
            }
        }
        return this.state.currentIndex !== leng ? this.setState({ currentIndex: listHeight.length -2 }) : null;
    }

    set diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
        if (this.fixedTop === fixedTop) return;
        this.fixedTop = fixedTop;
        this.refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.data !== this.props.data) {
            this._calculateHeight();
        }
    }

    render() {
        return (
            <React.Fragment>
                <Scroll className="singer-list" probeType={3} listenScroll={true}
                onScroll={this.onScroll} ref="singerList">
                    <ul>
                        {
                            this.props.data.map((grop, index) => (
                                <li className="list-group" key={grop.title} ref={el => { this.listGroup[index] = el;}}>
                                    <h2 className="list-group-title">{grop.title}</h2>
                                    <ul>
                                        {
                                            grop.items.map(item => (
                                                <li className="list-group-item" key={item.name} onClick={() => { this.selectItem(item);}}>
                                                    <img className="avatar" src={item.avatar} />
                                                    <span className="name">{item.name}</span>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </li>
                            ))
                        }
                    </ul>
                </Scroll >
                <div className="list-shortcut"
                    onTouchStart={this.onShotCutTouchStart}
                    onTouchMove={this.onShortcutTouchMove}
                    onTouchEnd={(e) => e.stopPropagation()}>
                    <ul>
                        {
                            this.shortcutList.map((item,index) => (
                                <li key={item}
                                    className={classnames('item', { 'current': this.state.currentIndex === index })}
                                    data-index={index}>{item}</li>
                            ))
                        }
                    </ul>
                </div>
                <div className={classnames('list-fixed', { hide: !this.fixedTitle })} ref="fixed">
                    <div className="fixed-title">{ this.fixedTitle }</div>
                </div>
                <div className={classnames('loading-container', { hide: this.props.data.length })}>
                    <Loading />
                </div>
            </React.Fragment>
        )
    }

    refresh() {
        this.refs.singerList.refresh();
    }

    onScroll(pos) {
        if (pos.y > 0) {
            return this.state.currentIndex !== -1 ? this.setState({ currentIndex: -1 }) : null;
        }
        this.scrollY = pos.y;
    }

    selectItem(item) {
        this.props.playerStore.setSinger(item);
        this.props.history.push(`/singer-detail/${item.id}`);
    }

    onShotCutTouchStart(e) {
        e.stopPropagation();
        let anchorIndex = getData(e.target, 'index');
        let firstTouch = e.touches[0];
        this.touch.y1 = firstTouch.pageY;
        this.touch.anchorIndex = anchorIndex;

        this._scrollTo(anchorIndex);
    }

    onShortcutTouchMove(e) {
        e.stopPropagation();
        let firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0;
        let anchorIndex = parseInt(this.touch.anchorIndex, 10) + delta;

        this._scrollTo(anchorIndex);
    }

    _scrollTo(index) {
        if (index < 0) {
            index = 0;
        } else if (index > this.listHeight.length - 2) {
            index = this.listHeight.length - 2;
        }
        this.refs.singerList.scrollToElement(this.listGroup[index], 0);
        this.scrollY = this.refs.singerList.scroll.y;
    }

    _calculateHeight() {
        let height = 0;
        const list = this.listGroup;
        this.listHeight = [];
        this.listHeight.push(height);
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            height += item.clientHeight;
            this.listHeight.push(height);
        }
    }
}

SingerList.defaultProps = {
    singers: []
};

export default SingerList;
