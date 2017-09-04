import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import AsyncApp from './AsyncApp.jsx'
// import {Layout} from 'antd'

const store = configureStore()

export default class Root extends Component {
	constructor(props){
		super(props);
		this.state = {
			num:0
		}
		this.handleMember = this.handleMember.bind(this)
	}
	handleMember(e){
		console.log(e)
		this.setState({
			num:e
		})
	}
	render() {
		return (
			<Provider store={store}>
				<div>
					<h1>聊天室(共{this.state.num}人)</h1>
					<AsyncApp handleMember={this.handleMember}/>
				</div>
			</Provider>
		)
	}
}