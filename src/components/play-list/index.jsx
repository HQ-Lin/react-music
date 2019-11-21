import React from 'react';
import './style.scss';
import { inject, observer } from 'mobx-react';
import { playMode } from '@assets/utils/config';
import classnames from 'classnames';
import Scroll from '@components/scroll';
import Confirm from '@components/confirm';
import AddSong from '@components/add-song';

@inject('playerStore')
@observer
class PlayList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showFlag: false,
            refreshDelay: 120
        };
    }

    get sequenceList() {
        return this.props.playerStore.sequenceList;
    }

    get currentSong() {
        return this.props.playerStore.currentSong;
    }

    get mode() {
        return this.props.playerStore.mode;
    }

    get iconMode() {
        return this.mode === playMode.sequence
            ? 'icon-sequence' : this.mode === playMode.loop
            ? 'icon-loop' : 'icon-random';
    }

    get modeText() {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环';
    }

    changeMode() {
        const mode = (this.mode + 1) % 3;
        this.setPlayMode(mode);
        let list = null;
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList);
        } else {
          list = this.sequenceList;
        }
        this.resetCurrentIndex(list);
        this.setPlaylist(list);
    }
    resetCurrentIndex(list) {
        const index = list.findIndex((item) => {
            return item.id === this.currentSong.id;
        });
        this.props.playerStore.setCurrentIndex(index);
    }

    toggleFavorite(song) {
        if (this.isFavorite(song)) {
            this.deleteFavoriteList(song);
        } else {
            this.saveFavoriteList(song);
        }
    }

    getFavoriteIcon(song) {
        if (this.isFavorite(song)) {
          return 'icon-favorite';
        }
        return 'icon-not-favorite';
    }

    isFavorite(song) {
        const index = this.favoriteList.findIndex((item) => {
          return item.id === song.id;
        })
        return index > -1;
    }

    show() {
        this.setState({ statshowFlag: true });
        setTimeout(() => {
            this.refs.listContent.refresh();
            this.scrollToCurrent(this.currentSong);
        }, 20);
      }
    hide() {
        this.setState({ statshowFlag: false });
    }
    showConfirm() {
        this.refs.confirm.show();
    }
    confirmClear() {
        this.deleteSongList();
        this.hide();
    }
    getCurrentIcon(item) {
        if (this.currentSong.id === item.id) {
            return 'icon-play';
        }
        return '';
    }
    selectItem(item, index) {
        if (this.mode === playMode.random) {
            index = this.playlist.findIndex(song => song.id === item.id);
        }
        this.setCurrentIndex(index);
        this.setPlayingState(true);
    }
    scrollToCurrent(current) {
        const index = this.sequenceList.findIndex(song => current.id === song.id);
        this.refs.listContent.scrollToElement(this.refs.listItem[index], 300);
    }
    deleteOne(item) {
        this.deleteSong(item);
        if (!this.playlist.length) this.hide();
    }
    addSong() {
        this.refs.addSong.show();
    }

    render() {
        const modeText = this.props.modeText;
        const { refreshDelay, showFlag } = this.state;

        return (
            <div onClick={this.hide.bind(this)} className={classnames('playlist', { hide: !showFlag })}>
                <div className="list-wrapper" onClick={e => { e.stopPropagation(); }}>
                    <div className="list-header">
                        <h1 className="title">
                            <i className={classnames('icon', this.iconMode)} onClick={this.changeMode.bind(this)}/>
                            <span className="text">{modeText}</span>
                            <span className="clear" onClick={this.showConfirm.bind(this)}>
                                <i className="icon-clear" />
                            </span>
                        </h1>
                    </div>
                    <Scroll ref="listContent" data={this.sequenceList} className="list-content" refreshDelay={refreshDelay}>
                        <ul>
                            {!!this.sequenceList.length
                                ? this.sequenceList.map((item, index) => (
                                    <li key={item.id}
                                        ref="listItem"
                                        className="item"
                                        onClick={this.selectItem.bind(this, item, index)}>
                                        <i className={classnames('current', this.getCurrentIcon(item))}></i>
                                        <span className="text">{item.name}</span>
                                        <span onClick={this.toggleFavorite.bind(this, item)} className="like">
                                            <i className={classnames(() => { this.getFavoriteIcon(item); })}></i>
                                        </span>
                                        <span onClick={this.deleteOne.bind(this, item)} className="delete">
                                            <i className="icon-delete"></i>
                                        </span>
                                    </li>
                                )) : null}
                        </ul>
                    </Scroll>
                    <div className="list-operate">
                        <div onClick={this.addSong.bind(this)} className="add">
                            <i className="icon-add" />
                            <span className="text">添加歌曲到队列</span>
                        </div>
                    </div>
                    <div onClick={this.hide} className="list-close">
                        <span>关闭</span>
                    </div>
                </div>
                <Confirm ref="confirm" confirm={this.confirmClear} text="是否清空播放列表" confirmBtnText="清空" />
                <AddSong ref="addSong" />
            </div>
        );
    }
}

export default PlayList;
