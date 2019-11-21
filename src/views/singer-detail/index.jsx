import React from 'react';
import { getSingerDetail } from '@api/singer.js';
import { ERR_OK } from '@api/config.js';
import { createSong } from '@assets/utils/song.js';
import { observer, inject } from 'mobx-react';
import MusicList from '@components/music-list';

@inject('playerStore')
@observer
class SingerDetail extends React.Component {
    constructor() {
        super();
        this.state = { songs: [] };
    }

    componentDidMount() {
        this._getDetail();
    }

    _getDetail() {
        const id = this.props.playerStore.singer.id;
        if (!id) return this.props.history.replace('/singer');

        getSingerDetail(id).then(res => {
            if (res.code === ERR_OK) {
                console.warn('getSingerDetail', res);
                this.setState({
                    songs: this._normalizeSongs(res.data.list)
                });
            }
        });
    }

    _normalizeSongs(list) {
        const ret = [];
        list.forEach((item) => {
            let { musicData } = item;
            if (musicData.songid && musicData.albummid) {
                ret.push(createSong(musicData));
            }
        })
        return ret;
    }

    render() {
        return (
            <MusicList
                    {...this.props}
                    title={this.props.playerStore.singer.name}
                    avatar={this.props.playerStore.singer.avatar}
                    songs={this.state.songs} />
        );
    }
}

export default SingerDetail;
