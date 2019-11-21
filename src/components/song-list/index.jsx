import React from 'react';
import './style.scss';
import classnames from 'classnames';

class SongList extends React.Component {
    selectItem(song, index) {
        this.props.onSelect(song, index);
    }

    getRankCls(index) {
        if (index <= 2) {
            return `icon icon${index}`;
        } else {
            return 'text';
        }
    }

    getRankText(index) {
        if (index > 2) {
            return index + 1;
        }
    }

    getDesc(song) {
        return `${song.singer}·${song.album}`;
    }

    render() {
        return (
            <ul className="song-list">
                {
                    this.props.songs.map((song, index) => (
                        <li className="item" onClick={() => { this.selectItem(song, index); }} key={song.id}>
                            <div className={classnames('rank', { hide: !this.props.rank })}>
                                <span className={this.getRankCls(index)}>{this.getRankText(index)}</span>
                            </div>
                            <div className="content">
                                <h2 className="name">{song.name}</h2>
                                <p className="desc">{this.getDesc(song)}</p>
                            </div>
                        </li>
                    ))
                }
            </ul>
        );
    }
}

export default SongList;
