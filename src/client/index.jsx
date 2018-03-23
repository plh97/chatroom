// package
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Route } from 'react-router';
import {
  BrowserRouter as Router,
  Link,
} from 'react-router-dom';
import { Provider, observer } from 'mobx-react';

// local
import store from './store/';
import AsyncApp from './components/AsyncApp';
import GithubReport from './components/GithubReport/index';
import './less/index.less';


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('SW registered: ', registration);
    }).catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}


@observer
export default class Root extends Component {
  componentWillMount() {
    document.ondragstart = () => false;
  }
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="routerContainer" >
            <Route
              exact
              path="/"
              render={() => (
                <div>
                  <h1>欢迎光临Github聊天室</h1>
                  <p><Link to="/group">open github chat</Link></p>
                </div>
            )}
            />
            <Route path="/group" component={AsyncApp} />
            <Route path="/githubReport/:name" component={GithubReport} />
            <div className="window" />
          </div>
        </Router>
      </Provider>
    );
  }
}

render(
  <Root />,
  document.getElementById('root'),
);
