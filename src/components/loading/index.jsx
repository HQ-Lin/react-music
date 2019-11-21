import React from 'react';
import './style.scss';

class Loading extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="loading">
                <div className="ball-clip-rotate">
                    <div></div>
                </div>
                <p className="desc">{this.props.title}</p>
            </div>
        );
    }
}

Loading.defaultProps = {
    title: '正在载入...'
};

export default Loading;
