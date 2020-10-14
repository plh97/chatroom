import React from 'react';
import {Provider} from 'react-redux'
import FrontendAuth from './components/frontendAuth'
import store from './store/index.js'
import './App.scss';
import {
  HashRouter as Router,
  Switch,
} from "react-router-dom";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App" data-testid="App">
          <Switch>
            <FrontendAuth />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
