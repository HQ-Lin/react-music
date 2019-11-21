import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import '@assets/scss';

import Header from '@components/header';
import Tab from '@components/tab';
import RouterMap from '@router';
import Player from '@components/player';
import store from '@store';

class App extends React.Component {
    render() {
        return [
            <Header key="header" />,
            <Tab key="tab" />,
            <RouterMap key="routerMap" />,
            <Player key="player" />
        ];
    }
}

ReactDOM.render((
    <Provider {...store}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>
), document.getElementById('App'));
