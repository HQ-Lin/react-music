import React from 'react';
import './style.scss';
import { debounce } from '@assets/utils/util.js';

class SearchBox extends React.Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this._search = debounce((newVal) => {
            this.props.onSearch(newVal);
        }, 200);
    }

    set query(newVal) {
        console.log('11', newVal);
        this._search(newVal);
    }

    handleChange(e) {
        this.query = e.target.value;
    }

    setQuery(query) {
        this.query = query;
    }

    blur() {
        this.refs.query.blur();
    }

    render() {
        return (
            <div className="search-box">
                <i className="icon-search"></i>
                <input ref="query"
                    type="search"
                    className="box"
                    onChange={this.handleChange}
                    placeholder={this.props.placeholder} />
            </div>
        )
    }
}

SearchBox.defaultProps = {
    placeholder: '搜索歌曲、歌手'
};

export default SearchBox;
