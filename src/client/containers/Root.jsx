import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import AsyncApp from './AsyncApp.jsx'
import Login from '../components/Login.jsx'
import Register from '../components/Register.jsx'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import {Layout} from 'antd'

const store = configureStore()

const Root = ()=>(
	<Provider store={store}>
		<Router>
			<div id="components-form-demo-normal-login" className='routerContainer' >
				<Route exact path="/" component={Login} />
				<Route path="/register" component={Register} />
				<Route path="/chat" component={AsyncApp} />
			</div>
		</Router>
	</Provider>
)

export default Root