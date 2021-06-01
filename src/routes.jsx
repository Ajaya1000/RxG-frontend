import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Entry, Home } from './pages';

const Routes = () => (
    <Router>
        <Switch>
            <Route exact path='/'>
                <Home />
            </Route>
            <Route exact path='/game'>
                <Entry />
            </Route>
        </Switch>
    </Router>
);

export default Routes;
