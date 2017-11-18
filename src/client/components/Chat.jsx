import React, { Component } from 'react'
import {
	Route,
	Link
} from 'react-router-dom'
import { Avatar, Icon } from 'antd'
import BodyContent from '../components/BodyContent.jsx'
import { inject, observer } from "mobx-react"
import {colorList} from '../../../config/client.js'

@inject("store")
@observer
export default class Chat extends Component {
	addRoom = (e) =>{
		const { myInfo } = this.props.store;
		this.props.store.socket({
			url:'add room',
			userId: myInfo._id,
			name: myInfo.github.name
		})
	}
	//只执行一次
	// componentWillMount(){
	// 	// console.log('componentWillMount');
	// }

	render() {
		const { match } = this.props
		const {
			doing,
			onlineUsers,
			myInfo
		} = this.props.store;
		return (
			<div className="body">
				<div className="slider">
					<h3 className="title">房间列表：</h3>
					{myInfo.groups.map((group,i)=>(
						<Link
							className="roomList"
							id={group.name}
							key={i}
							to={`${match.url}/${group.name}`}>
							<Avatar
								src={group.avatar_url}
								className="slideAvator"
								size="large"
								style={{backgroundColor: colorList[group.name.charCodeAt() % 8]}}>
								{group.name.split('')[0]}
							</Avatar>
							<span className="roomName">{group.name}</span>
						</Link>
					))}
					<span onClick={this.addRoom} className="addRoom">
						<Icon type="usergroup-add" />
						开房？
					</span>
				</div>
				<Route exact path={match.url} render={() => (
					<h3>Please select a room.</h3>
				)}/>
				<Route path={`${match.url}/:groupName`} component={BodyContent}/>
			</div>
		)
	}
};
