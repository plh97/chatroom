import React from 'react';
import { Provider } from 'react-redux'
import FrontendAuth from './components/FrontendAuth'
import store from './store'
import {
    HashRouter as Router,
    Switch,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react"
import '@src/styles/global.css';

function App() {
    return (
        <Provider store={store}>
            <ChakraProvider className="App" data-testid="App">
                <Router>
                    <Switch>
                        <FrontendAuth />
                    </Switch>
                </Router>
            </ChakraProvider>
        </Provider>
    );
}

export default App;
