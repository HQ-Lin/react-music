import React from 'react';
import './style.scss';

class Header extends React.Component {
    render() {
        return (
            <header className="header">
                <img src={require('@assets/image/pig.svg')} className="icon" alt="logo"/>
                <h1 className="text">Pig Music</h1>
                <div className="mine" to="/user">
                    <i className="icon-mine"></i>
                </div>
            </header>
        );
    }
}

export default Header;
