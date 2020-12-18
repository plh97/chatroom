import React from 'react';
import { Provider } from 'react-redux'
import FrontendAuth from './components/FrontendAuth'
import store from './store'
import './App.less';
import {
    HashRouter as Router,
    Switch,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react"
import Loading from './components/Loading'

function App() {
    return (
        <Provider store={store}>
            <Router>
                <ChakraProvider className="App" data-testid="App">
                    <Loading>
                        <Switch>
                            <FrontendAuth />
                        </Switch>
                    </Loading>
                </ChakraProvider>
            </Router>
        </Provider>
    );
}

export default App;
