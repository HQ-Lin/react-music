import { observable, computed, action, autorun } from 'mobx';
import { playMode } from '@assets/utils/config.js';
import { shuffle } from '@assets/utils/util.js';
import { saveSearch, clearSearch, deleteSearch, savePlay, saveFavorite, deleteFavorite } from '@assets/utils/cache.js';

function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id;
    });
}

class PlayerStore {
    @observable singer = {} // 歌手

    @action.bound setSinger(singer) {
        this.singer = singer;
    }

    @observable playing = false // 是否播放

    @action.bound setPlayingState(flag) {
        this.playing = flag;
    }

    @observable fullScreen = false; // 是否全屏

    @action.bound setFullScreen(flag) {
        this.fullScreen = flag;
    }

    @observable _playlist = [] // 播放列表

    @computed get playlist() {
        return this._playlist.slice();
    }

    @action.bound setPlayList(list) {
        this._playlist = list;
    }

    @observable _sequenceList = [] // 顺序播放列表

    @computed get sequenceList() {
        return this._sequenceList.slice();
    }

    @action.bound setSequenceList(list) {
        this._sequenceList = list;
    }

    @observable mode = playMode.sequence // 播放模式

    @action.bound setPlayMode(mode) {
        this.mode = mode;
    }

    @observable currentIndex = -1 // 播放歌曲索引

    @action.bound setCurrentIndex(index) {
        this.currentIndex = index;
    }

    @computed get currentSong() { // 当前播放的歌曲
        return this.playlist[this.currentIndex] || {};
    }

    @observable _favoriteList = [] // 收藏列表

    @computed get favoriteList() {
        return this._favoriteList.slice();
    }

    // 设置收藏歌曲
    @action.bound setFavoriteList(list) {
        this._favoriteList = list;
    }
    // 保存喜爱歌曲
    @action.bound saveFavoriteList(song) {
        this.setFavoriteList(saveFavorite(song));
    }
    // 删除喜爱歌曲
    @action.bound deleteFavoriteList(song) {
        this.setFavoriteList(deleteFavorite(song));
    }

    // 选择播放歌曲
    @action.bound selectPlay({list, index}) {
        this.setSequenceList(list);
        if (this.mode === playMode.random) {
            const randomList = shuffle(list);
            this.setPlayList(randomList);
            index = findIndex(randomList, list[index]);
        } else {
            this.setPlayList(list);
        }
        this.setCurrentIndex(index);
        this.setFullScreen(true);
        this.setPlayingState(true);
    }
    // 随机播放歌曲
    @action.bound randomPlay({list}) {
        this.setPlayMode(playMode.random);
        this.setSequenceList(list);
        const randomList = shuffle(list);
        this.setPlayList(randomList);
        this.setCurrentIndex(0);
        this.setFullScreen(true);
        this.setPlayingState(true);
    }

    @action.bound setTopList(topList) {
        this.topList = topList;
    }

    @action.bound setSearchHistory(history) {
        this.searchHistory = history;
    }

    @action.bound setPlayHistory(history) {
        this.playHistory = history;
    }
}

const playerStore = new PlayerStore();

autorun(() => {
    console.warn('playerStore: ', playerStore);
});

export default playerStore;
