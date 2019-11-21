import React from 'react';
import classnames from 'classnames';

class TopTip extends React.Component {
    static defaultProps = {
        delay: 2000
    }

    constructor(props) {
        super(props);
        this.state = { showFlag: false };
    }

    show() {
        this.setState({showFlag: true});
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.hide();
        }, this.props.delay);
    }

    hide(e) {
        e.stopPropagation();
        this.setState({showFlag: false});
    }

    render() {
        return (
            <div
                className="top-tip"
                className={classnames('top-tip', {
                    hide: !this.state.showFlag
                })}
                onClick={this.hide.bind(this)}>
                {this.props.children}
            </div>
        );
    }
}

export default TopTip;
