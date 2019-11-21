import React from 'react';
import classNames from 'classnames';
import './style.scss';
import Scroll from '@components/scroll';
import Loading from '@components/loading';
import { getTopList } from '@api/rank.js';
import {ERR_OK} from '@api/config.js';
class Rank extends React.Component {
    constructor() {
        super();
        this.state = {
            topList: []
        }
    }

    componentDidMount() {
        getTopList().then(res => {
            console.warn('res', res);
            if (res.code === ERR_OK) {
                this.setState({ topList: res.data.topList });
            }
        });
    }

    selectItem(item) {

        console.log('item', item);
    }
    render() {
        return (
            <div className="rank" ref="rank">
                <Scroll data={this.state.topList} className="toplist" ref="toplist">
                    <ul>
                        {
                            this.state.topList.map(item => (
                                <li className="item"
                                    key={item.id}
                                    onClick={() => { this.selectItem(item); }} >
                                    <div className="icon">
                                        <img width="100" height="100" src={item.picUrl} />
                                    </div>
                                    <ul className="songlist">
                                        {
                                            item && item.songList.map((song, index) => (
                                                <li className="song" key={song.songname}>
                                                    <span>{index + 1}</span>
                                                    <span>{song.songname}-{song.singername}</span>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </li>
                            ))
                        }
                    </ul>
                </Scroll>
                <div className={classNames('loading-container', { hide: this.state.topList.length })}>
                    <Loading />
                </div>
            </div>
        );
    }
}

export default Rank;
