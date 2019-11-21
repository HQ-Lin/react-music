import React from 'react';
import './style.scss';
import classnames from 'classnames';

class Confirm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showFlag: false };
    }

    show() {
        this.state.showFlag = true
    }
    hide() {
        this.state.showFlag = false
    }
    cancel() {
        this.hide();
        this.props.cancel();
    }
    confirm() {
        this.hide();
        this.props.confirm();
    }

    render() {
        return (
            <div className={classnames('confirm', { hide: !this.state.showFlag })}
                onClick={e => { e.stopPropagation(); }}>
                <div className="confirm-wrapper">
                    <div className="confirm-content">
                        <p className="text">{this.props.text}</p>
                        <div className="operate">
                            <div onClick={this.cancel.bind(this)} className="operate-btn left">
                                {this.props.cancelBtnText}
                            </div>
                            <div onClick={this.confirm.bind(this)} className="operate-btn">
                                {this.props.confirmBtnText}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Confirm;
