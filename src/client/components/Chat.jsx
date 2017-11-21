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
			url:'create group',
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
					{myInfo.groups.map((group,i)=>(
						<Link
							className="groupList"
							id={group.name}
							key={i}
							to={`${match.url}/${group.name}`}>
							<Avatar
								src={group.avatar_url}
								className="slideAvatar"
								size="large"
								style={{backgroundColor: colorList[group.name.charCodeAt() % 8]}}>
								{group.name.split('')[0]}
							</Avatar>
							<span className="groupName">{group.name}</span>
						</Link>
					))}
					<span onClick={this.addGroup} className="addgroup">
						<Icon type="usergroup-add" />
						创建群
					</span>
				</div>
				<Route exact path={match.url} render={() => (
					<h3>Please select a group.</h3>
				)}/>
				<Route path={`${match.url}/:groupName`} component={BodyContent}/>
			</div>
		)
	}
};
