import React from 'react';
import className from 'classnames';
import './style.scss';
import SearchBox from '@components/search-box';
import Scroll from '@components/scroll';

class Search extends React.Component {
    constructor() {
        super();
        this.state = {
            query: '',
            hotKey: []
        }
    }

    onSearch(query) {
        console.log('query', query);
    }

    render() {
        return (
            <div className="search">
                <div className="search-box-wrapper">
                    <SearchBox ref="searchBox" onSearch={this.onSearch} />
                </div>
                <div ref="shortcutWrapper"
                    className={className('shortcut-wrapper', { hide: !this.state.query })}>
                    <Scroll className="shortcut"
                            refreshDelay="refreshDelay"
                            ref="shortcut"
                            data={this.state.shortcut}>
                        <div>

                        </div>
                    </Scroll>
                </div>
            </div>
        );
    }
}

export default Search;
