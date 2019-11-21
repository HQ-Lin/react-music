import React from 'react';
import classNames from 'classnames';
import './style.scss';

import BScroll from 'better-scroll';
import { addClass } from '@assets/utils/dom';

class Slider extends React.Component {
    constructor() {
        super();
        this.state = {
            currentPageIndex: 0,
            dots: []
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this._setSliderWidth();
            this._initDots();
            this._initSlider();

            if (this.props.autoPlay) {
                this._play();
            }
        }, 20);

        window.addEventListener('resize', () => {
            if (!this.slider || !this.slider.enabled) return;
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                if (this.slider.isInTransition) {
                    this._onScrollEnd();
                } else {
                    if (this.props.autoPlay) {
                        this._play();
                    }
                }
                this.refresh();
            }, 60);
        });
    }

    render() {
        return (
            <div className="slider" ref="slider">
                <div className="slider-group" ref="sliderGroup">
                    {this.props.children}
                </div>
                <div className="dots">
                    {
                        this.state.dots.map((item) => (
                            <span key={`dot-${item}`} className={classNames('dot', { 'active': this.state.currentPageIndex === item })}>1</span>
                        ))
                    }
                </div>
            </div>
        );
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
        clearTimeout(this.resizeTimer);
    }

    _setSliderWidth(isResize) {
        this.children = Array.from(this.refs.sliderGroup.children);

        let width = 0;
        let sliderWidth = this.refs.slider.clientWidth;

        this.children.forEach(item => {
            addClass(item, 'slider-item');

            item.style.width = `${sliderWidth}px`;
            width += sliderWidth;
        });

        if (this.props.loop && !isResize) {
            width += 2 * sliderWidth;
        }
        this.refs.sliderGroup.style.width = `${width}px`;
    }

    _initDots() {
        this.setState({
            dots: this.children.map((item, index) => index)
        });
    }

    _initSlider() {
        this.slider = new BScroll(this.refs.slider, {
            scrollX: true,
            scrollY: false,
            momentum: false,
            snap: {
                loop: this.props.loop,
                threshold: 0.3,
                speed: 400
            }
        });

        this.slider.on('scrollEnd', this._onScrollEnd.bind(this));

        this.slider.on('beforeScrollStart', () => {
            if (this.props.autoPlay) {
                clearTimeout(this.timer);
            }
        });
    }

    _onScrollEnd() {
        let pageIndex = this.slider.getCurrentPage().pageX;
        this.setState({
            currentPageIndex: pageIndex
        });
        if (this.props.autoPlay) {
            this._play();
        }
    }

    _play() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.slider.next();
        }, this.props.interval);
    }

    refresh() {
        if (this.slider) {
            this._setSliderWidth(true);
            this.slider.refresh();
        }
    }
}

// 默认props
Slider.defaultProps = {
    loop: true,
    autoPlay: true,
    interval: 3000,
};

export default Slider;
