import React, { Component } from 'react'
import {render} from 'react-dom'
import AsyncApp from './containers/AsyncApp.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import { Route, Redirect } from 'react-router'
import createHistory from 'history/createBrowserHistory'
import {
	BrowserRouter as Router,
	Link
} from 'react-router-dom'
import "./less/index.less"
import store from "./store/"
import {Provider,observer} from "mobx-react"
import config from "../../config/server.js";
const history = createHistory()
//login page
// TODO:

//chat page
// TODO:
// the default page
// if not has no token --> login page
// post token to backend , check it whether right or worry
// but how about nodejs to found the session?
// if token  incorrect / send callBack info to front-end
// 后台在进入的时候直接验证session是否正确。。


@observer
export default class Root extends Component{
	componentDidUpdate(){
		Prism.highlightAll()
	}
	render(){
		const { callBack } = store;
		if( callBack.code==0 || callBack.code==2 ){
			localStorage.setItem("token", callBack.token);
		}
		return(
			<Provider store={store}>
				<Router>
					<div className='routerContainer' >
						<a href={`https://github.com/login/oauth/authorize?client_id=${config.githubClientID}&redirect_uri=${process.env.NODE_ENV=="production" ? "https://chat.penlh.com/auth" : "https://localhost:443/auth"}`}>auth</a>
						<Route exact path="/login" component={Login} />
						<Route path="/register" component={Register} />
						<Route path="/" component={AsyncApp} />
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
