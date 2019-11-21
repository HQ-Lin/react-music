import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Recommend from '@views/recommend';
import Disc from '@views/disc';
import Singer from '@views/singer';
import Rank from '@views/rank';
import Search from '@views/search';
import singerDetail from '@views/singer-detail';

class RouterMap extends React.Component {
    render() {
        return (
            <Switch>
                <Route component={Recommend} path="/recommend" />
                <Route component={Disc} path="/disc/:id" />
                <Route component={Singer} path="/singer" />
                <Route component={singerDetail} path="/singer-detail/:id" />
                <Route component={Rank} path="/rank" />
                <Route component={Search} path="/search" />
                <Redirect to="/recommend" />
            </Switch>
        );
    }
}

export default RouterMap;
