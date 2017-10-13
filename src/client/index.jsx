import React, { Component } from 'react'
import {render} from 'react-dom'
import AsyncApp from './containers/AsyncApp.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import { Route, Redirect } from 'react-router'
import {
	BrowserRouter as Router,
	Link
} from 'react-router-dom'
import "./less/index.less"
import store from "./store/"
import {Provider,observer} from "mobx-react"

@observer
export default class Root extends Component{
	render(){
	const { callBack } = store;
		return(
			<Provider store={store}>
				<Router>
					<div className='routerContainer' >
						<Route exact path='/' render={() => ( callBack.code==0 || callBack.code==2) ? <Redirect to="/chat"/> : <Login/>} />
						<Route path='/register' render={() => callBack.code==0 ? <Redirect to="/chat"/> : <Register/>} />
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
