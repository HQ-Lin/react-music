import React from 'react';
import './style.scss';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';
import { playMode } from '@assets/utils/config';
import { shuffle } from '@assets/utils/util.js';
import Scroll from '@components/scroll';
import ProgressBar from '@components/progress-bar';
import ProgressCircle from '@components/progress-circle';
import PlayList from '@components/play-list';

@inject('playerStore')
@observer
class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLyric: null,
            songReady: false,
            currentTime: 0,
            radius: 32,
            currentLineNum: 0,
            currentShow: 'cd',
            playingLyric: '',
        };
    }

    get playlist() {
        return this.props.playerStore.playlist;
    }

    get fullScreen() {
        return this.props.playerStore.fullScreen;
    }

    get currentSong() {
        return this.props.playerStore.currentSong;
    }

    get playing() {
        return this.props.playerStore.playing;
    }

    get mode() {
        return this.props.playerStore.mode;
    }

    get sequenceList() {
        return this.props.playerStore.sequenceList;
    }

    get cdCls() {
        return this.playing ? 'play' : 'play pause';
    }

    get playIcon() {
        return this.props.playerStore.playing ? 'icon-pause' : 'icon-play';
    }

    get iconMode() {
        return this.mode === playMode.sequence
            ? 'icon-sequence' : this.mode === playMode.loop
            ? 'icon-loop' : 'icon-random';
    }

    get miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
    }
    // 播放百分比
    get percent() {
        return (this.state.currentTime / this.currentSong.duration) || 0;
    }

    back() {
        this.props.playerStore.setFullScreen(false);
    }

    open() {
        this.props.playerStore.setFullScreen(true);
    }

    toggleFavorite(song) {
        if (this.isFavorite(song)) {
            this.props.playerStore.deleteFavoriteList(song);
        } else {
            this.props.playerStore.saveFavoriteList(song);
        }
    }

    getFavoriteIcon(song) {
        if (this.isFavorite(song)) {
            return 'icon-favorite';
        }
        return 'icon-not-favorite';
    }

    isFavorite(song) {
        const index = this.props.playerStore.favoriteList.findIndex((item) => {
            return item.id === song.id;
        })
        return index > -1;
    }

    changeMode() {
        const mode = (this.mode + 1) % 3;
        this.props.playerStore.setPlayMode(mode);
        let list = null;
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList);
        } else {
          list = this.sequenceList;
        }
        this.resetCurrentIndex(list);
        this.props.playerStore.setPlayList(list);
      }

    resetCurrentIndex(list) {
        const index = list.findIndex((item) => {
            return item.id === this.currentSong.id;
        });
        this.props.playerStore.setCurrentIndex(index);
    }

    middleTouchStart() {

    }

    middleTouchMove() {

    }

    middleTouchEnd() {

    }

    onProgressBarChange(percent) {
        const currentTime = this.currentSong.duration * percent;
        this.refs.audio.currentTime = currentTime;
        if (!this.playing) {
          this.togglePlaying();
        }
        if (this.state.currentLyric) {
          this.state.currentLyric.seek(currentTime * 1000);
        }
    }

    togglePlaying() {
        if (!this.state.songReady) return;

        this.props.playerStore.setPlayingState(!this.props.playerStore.playing);
        if (this.state.currentLyric) {
          this.state.currentLyric.togglePlay();
        }
    }

    end() {
        if (this.mode === playMode.loop) {
            this.loop();
        } else {
            this.next();
        }
    }

    loop() {
        this.refs.audio.currentTime = 0;
        this.refs.audio.play();
        this.setPlayingState(true);
        if (this.state.currentLyric) {
            this.state.currentLyric.seek(0);
        }
    }

    next() {
        if (!this.state.songReady) return;

        if (this.playlist.length === 1) {
            return this.loop();
        } else {
            let index = this.currentIndex + 1;
            if (index === this.playlist.length) {
                index = 0;
            }
            this.setCurrentIndex(index);
            if (!this.playing) {
                this.togglePlaying();
            }
        }
        this.setState({ songReady: false });
    }

    prev() {
        if (!this.songReady) return;
        if (this.playlist.length === 1) {
            return this.loop();
        } else {
            let index = this.currentIndex - 1;
            if (index === -1) {
                index = this.playlist.length - 1;
            }
            this.setCurrentIndex(index);
            if (!this.playing) {
                this.togglePlaying();
            }
        }
        this.setState({ songReady: false });
    }

    ready() {
        this.setState({ songReady: true });
        this.savePlayHistory(this.currentSong);
    }

    error() {
        this.setState({ songReady: true });
    }

    updateTime(e) {
        this.setState({ currentTime: e.target.currentTime });
    }

    showPlaylist() {
        this.refs.playlist.show();
    }

    format(interval) {
        interval = interval | 0;
        const minute = interval / 60 | 0;
        const second = this._pad(interval % 60);
        return `${minute}:${second}`;
    }

    _pad(num, n = 2) {
        let len = num.toString().length;
        while (len < n) {
          num = '0' + num;
          len++;
        }
        return num;
    }

    render() {
        const {
            currentLyric,
            currentLineNum,
            currentShow,
            currentTime,
            songReady,
            radius,
            playingLyric,
        } = this.state;
        return (
            <div className={classnames('player', { hide: !this.playlist.length })}>
                <div className={classnames('normal-player', { hide: !this.fullScreen })}>
                    <div className="background">
                        <img width="100%" src={this.currentSong.image} />
                    </div>
                    <div className="top">
                        <div className="back" onClick={this.back.bind(this)}>
                            <i className="icon-back"></i>
                        </div>
                        <h1 className="title">{this.currentSong.name}</h1>
                        <h2 className="subtitle">{this.currentSong.singer}</h2>
                    </div>
                    <div className="middle"
                        onTouchStart={this.middleTouchStart}
                        onTouchMove={this.middleTouchMove}
                        onTouchEnd={this.middleTouchEnd}
                    >
                        <div className="middle-l" ref="middleL">
                            <div className="cd-wrapper" ref="cdWrapper">
                                <div className={classnames('cd', this.cdCls)}>
                                    <img className="image" src={this.currentSong.image} />
                                </div>
                            </div>
                            <div className="playing-lyric-wrapper">
                                <div className="playing-lyric">{playingLyric}</div>
                            </div>
                        </div>
                        <Scroll className="middle-r" ref="lyricList" data={currentLyric && currentLyric.lines}>
                            <div className="lyric-wrapper">
                                {
                                    currentLyric ? currentLyric.lines.map((line,index) => {
                                        <p ref="lyricLine"
                                            className={classnames('text', {'current': currentLineNum === index})}>{line.txt}</p>
                                    }) : null
                                }
                            </div>
                        </Scroll>
                    </div>
                    <div className="bottom">
                        <div className="dot-wrapper">
                            <span className={classnames('dot', {active: currentShow==='cd'})}></span>
                            <span className={classnames('dot', {active: currentShow==='lyric'})}></span>
                        </div>
                        <div className="progress-wrapper">
                            <span className="time time-l">{this.format(currentTime)}</span>
                            <div className="progress-bar-wrapper">
                                <ProgressBar percent={this.percent} onPercentChange={this.onProgressBarChange.bind(this)} />
                            </div>
                            <span className="time time-r">{this.format(this.currentSong.duration)}</span>
                        </div>
                        <div className="operators">
                            <div className="icon i-left" onClick={this.changeMode.bind(this)}>
                                <i className={this.iconMode}></i>
                            </div>
                            <div className={classnames('icon', 'i-left', { 'disable': songReady })}>
                                <i onClick={this.prev.bind(this)} className="icon-prev"></i>
                            </div>
                            <div className={classnames('icon', 'i-center', { 'disable': songReady })}>
                                <i onClick={this.togglePlaying.bind(this)} className={this.playIcon}></i>
                            </div>
                            <div className={classnames('icon', 'i-right', { 'disable': songReady })}>
                                <i onClick={this.next.bind(this)} className="icon-next"></i>
                            </div>
                            <div className="icon i-right">
                                <i onClick={this.toggleFavorite.bind(this, this.currentSong)} className={classnames('icon', () => { this.getFavoriteIcon(this.currentSong); })}></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={classnames('mini-player', { hide: this.fullScreen })} onClick={this.open.bind(this)}>
                    <div className="icon">
                        <img className={this.cdCls} width="40" height="40" src={this.currentSong.image} />
                    </div>
                    <div className="text">
                    <h2 className="name">{this.currentSong.name}</h2>
                    <p className="desc">{this.currentSong.singer}</p>
                    </div>
                    <div className="control">
                    <ProgressCircle radius={radius} percent={this.percent}>
                        <i onClick={this.togglePlaying} className={classnames('icon-mini', this.miniIcon)}></i>
                    </ProgressCircle>
                    </div>
                    <div className="control" onClick={this.showPlaylist.bind(this)}>
                        <i className="icon-playlist"></i>
                    </div>
                </div>

                <PlayList ref="playlist"></PlayList>
                <audio
                    ref="audio"
                    src={this.currentSong.url}
                    onPlay={this.ready.bind(this)}
                    onError={this.error.bind(this)}
                    onTimeUpdate={this.updateTime.bind(this)}
                    onEnded={this.end.bind(this)}></audio>
            </div>
        );
    }
}

export default Player;
