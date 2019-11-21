import React from 'react';
import './style.scss';
import classnames from 'classnames';

import Scroll from '@components/scroll';
import Loading from '@components/loading';
import SongList from '@components/song-list';
import { prefixStyle } from '@assets/utils/dom.js';

const RESERVED_HEIGHT = 40;
const transform = prefixStyle('transform');
const backdrop = prefixStyle('backdrop-filter');

class MusicList extends React.Component {
    constructor() {
        super();
        this.back = this.back.bind(this);
        this.scroll = this.scroll.bind(this);
        this.selectItem = this.selectItem.bind(this);
    }

    set scrollY(newVal) {
        const percent = Math.abs(newVal / this.imageHeight);
        let translateY = Math.max(this.minTransalteY, newVal);
        let scale = 1;
        let zIndex = 0;
        let blur = 0;
        if (newVal > 0) {
          scale = 1 + percent;
          zIndex = 10;
        } else {
          blur = Math.min(20, percent * 20);
        }

        this.refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
        this.refs.filter.style[backdrop] = `blur(${blur}px)`;
        if (newVal < this.minTransalteY) {
          zIndex = 10;
          this.refs.bgImage.style.paddingTop = 0;
          this.refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
          this.refs.playBtn.style.display = 'none';
        } else {
          this.refs.bgImage.style.paddingTop = '70%';
          this.refs.bgImage.style.height = 0;
          this.refs.playBtn.style.display = 'block';
        }
        this.refs.bgImage.style[transform] = `scale(${scale})`;
        this.refs.bgImage.style.zIndex = zIndex;
    }

    componentDidMount() {
        this.imageHeight = this.refs.bgImage.clientHeight;
        this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT;
        this.refs.list.refs.wrapper.style.top = `${this.imageHeight}px`;
    }

    back() {
        this.props.history.goBack();
    }

    scroll(pos) {
        this.scrollY = pos.y;
    }

    random() {
        // 未完待续
    }

    selectItem(_song, index) {
        this.props.playerStore.selectPlay({
            index,
            list: this.props.songs
        });
    }

    render() {
        return (
            <div className="music-list">
                <div className="back" onClick={this.back}>
                    <i className="icon-back"></i>
                </div>
                <h1 className="title">{this.props.title}</h1>
                <div ref="bgImage"
                    className="bg-image"
                    style={{backgroundImage: `url(${this.props.avatar})`}}>
                    <div className="play-wrapper">
                        <div ref="playBtn"
                            onClick={this.random}
                            className={classnames('play', { hide: !this.props.songs.length })} >
                            <i className="icon-play"></i>
                            <span className="text">随机播放全部</span>
                        </div>
                    </div>
                    <div className="filter" ref="filter"></div>
                </div>
                <div className="bg-layer" ref="layer"></div>
                <Scroll className="list"
                    data={this.props.songs}
                    onScroll={this.scroll.bind(this)}
                    listenScroll={true}
                    probeType={3}
                    ref="list">
                    <div className="song-list-wrapper">
                        <SongList
                            songs={this.props.songs}
                            rank={this.props.rank}
                            onSelect={this.selectItem} />
                    </div>
                </Scroll>
                <div className={classnames('loading-container', { hide: this.props.songs.length })}>
                    <Loading />
                </div>
          </div>
        );
    }
}

MusicList.defaultProps = {
    avatar: '',
    songs: [],
    title: '',
    rank: false,
};

export default MusicList;
