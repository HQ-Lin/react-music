import React from 'react';
import { NavLink } from 'react-router-dom';
import './style.scss';

class Tab extends React.Component {
    render() {
        return (
            <nav className="tab">
                <NavLink to={{ pathname: '/recommend' }} className="tab-item" activeClassName="active">
                    <span className="tab-link">推荐</span>
                </NavLink>
                <NavLink to={{ pathname: '/singer' }} className="tab-item" activeClassName="active">
                    <span className="tab-link">歌手</span>
                </NavLink>
                <NavLink to={{ pathname: '/rank' }} className="tab-item" activeClassName="active">
                    <span className="tab-link">排行</span>
                </NavLink>
                <NavLink to={{ pathname: '/search' }} className="tab-item" activeClassName="active">
                    <span className="tab-link">搜索</span>
                </NavLink>
            </nav>
        );
    }
}

export default Tab;
