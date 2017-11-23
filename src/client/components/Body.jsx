import React, { Component } from 'react'
import {
	Route,
	Link
} from 'react-router-dom'
import { Avatar, Icon } from 'antd'
import Slider from '../components/Slider.jsx'
import Content from '../components/Content.jsx'
import { inject, observer } from "mobx-react"
import { colorList } from '../../../config/client.js'

@inject("store")
@observer
export default class Body extends Component {

	//只执行一次
	// componentWillMount(){
	// 	// console.log('componentWillMount');
	// }

	render() {
		const { match } = this.props
		return (
			<div className="body">
				<Slider match={match} />
				<Route exact path={match.url} render={() => (
					<h1>Please select a group.</h1>
				)} />
				<Route path={`${match.url}/:group_name`} component={Content} />
			</div>
		)
	}
};
