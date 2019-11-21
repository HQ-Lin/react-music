import React from 'react';
import classnames from 'classnames';
import './style.scss';

import { getRecommend, getDiscList} from '@api/recommend';
import { ERR_OK } from '@api/config';
import Scroll from '@components/scroll';
import Slider from '@components/slider';
import Loading from '@components/loading';

class Recommend extends React.Component {
    constructor() {
        super();
        this.state = {
            recommends: [],
            discList: []
        };
    }
    componentDidMount() {
        // 获取轮播信息
        getRecommend().then(res => {
            if (res.code === ERR_OK) {
                console.warn('/api/getRecommend', res.data);
                this.setState({
                    recommends: res.data.slider
                });
            }
        });
        // 获取歌单列表信息
        getDiscList().then(res => {
            if (res.code === ERR_OK) {
                console.warn('/api/getDiscList', res.data);
                this.setState({
                    discList: res.data.list
                });
            }
        });
    }

    componentDidUpdate() {
        setTimeout(() => {
            this.refs.slider && this.refs.slider.refresh();
        }, 20);
    }

    render() {
        return (
            <div className="recommend">
                <Scroll className="recommend-content" ref="scroll" data={this.state.discList}>
                    <section>
                        {
                            this.state.recommends.length ? (
                                <div className="slider-wrapper">
                                    <div className="slider-content">
                                        <Slider ref="slider">
                                            {
                                                this.state.recommends.map(item => (
                                                    <div key={item.id}>
                                                        <a href={item.linkUrl}>
                                                            <img onLoad={this.loadImage.bind(this)} src={item.picUrl} />
                                                        </a>
                                                    </div>
                                                ))
                                            }
                                        </Slider>
                                    </div>
                                </div>
                            ) : null
                        }
                        <div className="recommend-list">
                            <h1 className="list-title">热门歌单推荐</h1>
                            <ul>
                                {
                                    this.state.discList.map(item => (
                                        <li className="item" key={item.dissid} onClick={this.selectItem.bind(this, item)}>
                                            <div className="icon">
                                                <img width="60" height="60" src={item.imgurl} />
                                            </div>
                                            <div className="text">
                                                <h2 className="name">{item.creator.name}</h2>
                                                <p className="desc">{item.dissname}</p>
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className={classnames({ hide: this.state.discList.length })}>
                            <Loading />
                        </div>
                    </section>
                </Scroll>
            </div>
        );
    }

    loadImage() {
        if (!this.checkloaded) {
            this.checkloaded = true;
            setTimeout(() => {
                this.refs.scroll.refresh();
            }, 20);
        }
    }

    selectItem(item) {
        console.log('item', item);
        this.props.history.push(`/disc/${item.dissid}`);
    }
}

export default Recommend;
