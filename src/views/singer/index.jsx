import React from 'react';
import './style.scss';
import { ERR_OK } from '@api/config';
import { getSingerList } from '@api/singer';
import SingerList from '@components/singer-list';


const HOT_SINGER_LEN = 10;
const HOT_NAME = '热门';

class Singer extends React.Component {
    constructor() {
        super();
        this.state = {
            singers: []
        };
    }

    componentDidMount() {
        getSingerList().then((res) => {
            console.warn('getSingerList', res);
            if (res.code === ERR_OK) {
                this.setState({
                    singers: this._normalizeSinger(res.data.list)
                });
            }
        });
    }

    render() {
        return (
            <div className="singer" ref="singer">
                <SingerList data={this.state.singers} {...this.props} />
            </div>
        );
    }

    _normalizeSinger(list) {
        const map = new Map();
        map.set(HOT_NAME, { title: HOT_NAME, items: [] });
        list.forEach((item, index) => {
            if (index < HOT_SINGER_LEN) {
                map.get(HOT_NAME).items.push({
                    id: item.Fsinger_mid,
                    name: item.Fsinger_name,
                    avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`,
                });
            }
            if (!map.has(item.Findex)) {
                map.set(item.Findex, { title: item.Findex, items: [] });
            }
            map.get(item.Findex).items.push({
                id: item.Fsinger_mid,
                name: item.Fsinger_name,
                avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`,
            });
        });
        const hot = [map.get(HOT_NAME)];
        const ret = [...map].filter(item => {
            return item[0].match(/([a-zA-Z])/);
        }).sort((a, b) => {
            return a[0].charCodeAt(0) - b[0].charCodeAt(0);
        });
        ret.forEach(item => {
            hot.push(item[1]);
        });
        return hot;
    }
}

export default Singer;
