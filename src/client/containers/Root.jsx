import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import AsyncApp from './AsyncApp.jsx'
import {Layout,Gird} from 'antd'

const store = configureStore()

export default class Root extends Component {
	render() {
		return (
			<Provider store={store}>
				<Layout>
					<header>
						<h1>聊天室</h1>
					</header>
					<Layout>
						<AsyncApp />
					</Layout>
				</Layout>
			</Provider>
		)
	}
}