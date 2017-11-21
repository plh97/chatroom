import React, { Component } from 'react'
import {render} from 'react-dom'
import AsyncApp from './containers/AsyncApp.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import GithubReport from './components/GithubReport.jsx'
import Canvas from './components/Canvas.jsx'
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
const history = createHistory()

@observer
export default class Root extends Component{
	componentWillMount(){
		document.ondragstart= () => false
	}
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
						<Route exact path="/" render={
							()=>(
								<div>
									<h1>说点什么好呢？</h1>
									<p>
										reference:<a target="_blank" href='https://discordapp.com'>Discord</a>
										<Link to='/group'>open github chat</Link>
									</p>
								</div>
							)
						} />
						<Route path="/group" component={AsyncApp} />
						<Route path="/githubReport" component={GithubReport} />
						<Route path="/login" component={Login} />
						<Route path="/register" component={Register} />
						<div className='window'></div>
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
