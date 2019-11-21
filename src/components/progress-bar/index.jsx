import React from 'react';
import './style.scss';
import { prefixStyle } from '@assets/utils/dom.js';

const progressBtnWidth = 16;
const transform = prefixStyle('transform');

class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
        this.touch = {};
    }

    componentWillReceiveProps(nextProps) {
        const newPercent = nextProps.percent;
        if (newPercent >= 0 && !this.touch.initiated) {
            const barWidth = this.refs.progressBar.clientWidth - progressBtnWidth;
            const offsetWidth = newPercent * barWidth;
            this._offset(offsetWidth);
        }
    }

    progressTouchStart(e) {
        this.touch.initiated = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.left = this.refs.progress.clientWidth;
    }
    progressTouchMove(e) {
        if (!this.touch.initiated) return;

        const deltaX = e.touches[0].pageX - this.touch.startX;
        const offsetWidth = Math.min(this.refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX));
        this._offset(offsetWidth);
    }

    progressTouchEnd(e) {
        this.touch.initiated = false;
        this._triggerPercent();
    }

    progressClick(e) {
        const rect = this.refs.progressBar.getBoundingClientRect();
        const offsetWidth = e.pageX - rect.left;
        this._offset(offsetWidth);
        // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
        // this._offset(e.offsetX)
        this._triggerPercent();
    }

    _triggerPercent() {
        const barWidth = this.refs.progressBar.clientWidth - progressBtnWidth;
        const percent = this.refs.progress.clientWidth / barWidth;
        this.props.onPercentChange(percent);
    }

    _offset(offsetWidth) {
        this.refs.progress.style.width = `${offsetWidth}px`;
        this.refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
    }

    render() {
        return (
            <div className="progress-bar"
                ref="progressBar"
                onClick={this.progressClick.bind(this)}>
                <div className="bar-inner">
                    <div className="progress" ref="progress" />
                    <div className="progress-btn-wrapper"
                        ref="progressBtn"
                        onTouchStart={this.progressTouchStart.bind(this)}
                        onTouchMove={this.progressTouchMove.bind(this)}
                        onTouchEnd={this.progressTouchEnd.bind(this)}
                    >
                        <div className="progress-btn"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProgressBar;
