import React from 'react';
import { Route } from 'react-router-dom';

import Sider from '../components/Sider.jsx';
import Header from '../components/Header.jsx';
import Trigger from '../features/Trigger.js';
import Content from '../components/Content.jsx';
import UserDetails from '../components/UserDetails/index.jsx';

const AsyncApp = ({ match }) => (
  <Trigger className="container">
    <Sider match={match} />
    <div className="body">
      <Header />
      <Route
        exact
        path={match.url}
        render={() => (
          <h1>Please select a group.</h1>
        )}
      />
      <Route path={`${match.url}/:group_name`} component={Content} />
    </div>
    <UserDetails />
  </Trigger>
);
export default AsyncApp;
