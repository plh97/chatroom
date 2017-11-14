import React, { Component } from 'react'
import {render} from 'react-dom'
import AsyncApp from './containers/AsyncApp.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import { Route, Redirect,  } from 'react-router'
import createHistory from 'history/createBrowserHistory'
import {
	BrowserRouter as Router,
	Link,
	Switch
} from 'react-router-dom'
import {Provider,observer} from "mobx-react"
import "./less/index.less"
import store from "./store/"
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
		const Topics = ({ match }) => (
			<div>
				<Link to={`${match.url}/rendering`}>
					Rendering with React
				</Link>
				<Route path={`${match.url}/:topicId`} render={({match})=>(
					<h3>{match.params.topicId}</h3>
				)} />
				<Route exact path={match.url} render={() => (
					<h3>Please select a topic.</h3>
				)} />
			</div>
		)
		return(
			<Provider store={store}>
				<Router>
					<div className='routerContainer' >
						<a href={`https://github.com/login/oauth/authorize?client_id=${config.githubClientID}`}>auth</a>
						<Route exact path="/" render={
							()=>(
								<div>
									<h3>额貌似由于react-router（前台路由）匹配的特性，我无法做到用‘/’来匹配所有房间，所以‘/’我只能用来堆放广告，介绍，android，。</h3>
									<p>
										reference:<a target="_blank" href='https://discordapp.com'>Discord</a>
										<Link to='/room'>open github chat</Link>
									</p>
								</div>
							)
						} />
						<Route path="/room" component={AsyncApp} />
						<Route path="/login" component={Login} />
						<Route path="/register" component={Register} />
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
