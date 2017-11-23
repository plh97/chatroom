import React, { Component } from 'react'
import {render} from 'react-dom'
import AsyncApp from './containers/AsyncApp.jsx'
import GithubReport from './components/GithubReport.jsx'
// import Canvas from './components/Canvas.jsx'
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
		return(
			<Provider store={store}>
				<Router>
					<div className='routerContainer' >
						<Route exact path="/" render={()=>(
							<div>
								<h1>欢迎光临Github聊天室</h1>
								<p>
									reference:<a target="_blank" href='https://discordapp.com'>Discord</a>
									<Link to='/group'>open github chat</Link>
								</p>
							</div>
						)} />
						<Route path="/group" component={AsyncApp} />
						<Route path="/githubReport" component={GithubReport} />
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
