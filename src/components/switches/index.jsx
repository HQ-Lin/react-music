import React from 'react';
import classnames from 'classnames';
import './style.scss';

class Switches extends React.Component {
    static defaultProps = {
        switches: [],
        currentIndex: 0,
    }
    switchItem(index) {
        this.props.switch(index);
    }
    render() {
        const { switches, currentIndex } = this.props;

        return (
            <ul className="switches">
                {
                    !!switches.length ? switches.map((item, index) => (
                        <li className={classnames('switch-item', {
                            'active': currentIndex === index
                        })}
                        onClick={this.switchItem.bind(this, index)}>
                            <span key={index}>{item.name}</span>
                        </li>
                    )) : null
                }
          </ul>
        );
    }
}

export default Switches;
