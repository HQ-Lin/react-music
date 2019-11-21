import React from 'react';
import BScroll from 'better-scroll';

const DIRECTION_H = 'horizontal';
const DIRECTION_V = 'vertical';

class Scroll extends React.Component {
    constructor(props) {
        super(props);
        this._initScroll = this._initScroll.bind(this);
    }

    componentDidMount() {
        setTimeout(() => this._initScroll(), 20);
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            setTimeout(() => this.refresh(), this.props.refreshDelay);
        }
    }

    componentWillUnmount() {
        this.scroll && this.scroll.off('beforeScrollStart');
        this.scroll && this.scroll.off('scroll');
        this.scroll && this.scroll.off('scrollEnd');
    }

    _initScroll() {
        if (!this.refs.wrapper) return;

        this.scroll = new BScroll(this.refs.wrapper, {
            probeType: this.props.probeType,
            click: this.props.click,
            eventPassthrough: this.props.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V
        });

        if (this.props.listenScroll) {
            this.scroll.on('scroll', (pos) => this.props.onScroll(pos));
        }

        if (this.props.pullup) {
            this.scroll.on('scrollEnd', () => {
                if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                    this.props.pullup();
                }
            });
        }

        if (this.props.beforeScroll) {
            this.scroll.on('beforeScrollStart', () => {
                this.props.beforeScroll();
            });
        }
    }

    disable() {
        this.scroll && this.scroll.disable();
    }

    enable() {
        this.scroll && this.scroll.enable();
    }

    refresh() {
        this.scroll && this.scroll.refresh();
    }

    scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    }

    scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }

    // render
    render() {
        return (
            <div ref="wrapper" className={this.props.className}>
                {this.props.children}
            </div>
        );
    }
}

// 默认props
Scroll.defaultProps = {
    probeType: 1,
    click: false,
    listenScroll: false,
    data: null,
    pullup: false,
    beforeScroll: false,
    refreshDelay: 20,
    direction: DIRECTION_V
};

export default Scroll;
