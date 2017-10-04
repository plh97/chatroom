import React, { Component } from 'react'
import {render} from 'react-dom'
import AsyncApp from './containers/AsyncApp.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import {
	BrowserRouter as Router,
	Route,
	Link
} from 'react-router-dom'
import "./less/index.less"
import store from "./store/"
import {Provider} from "mobx-react"

export default class Root extends Component{
	render(){
		return(
			<Provider store={store}>
				<Router>
					<div className='routerContainer' >
						<Route exact path="/" component={Login} />
						<Route path="/register" component={Register} />
						<Route path="/chat" component={AsyncApp} />
						<div className="window"></div>
					</div>
				</Router>
			</Provider>
		)
	}
}

render(
	<Root/>,
	document.getElementById('root')
)