import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
	fetchGetsIfNeeded,
	inputSubreddit
} from '../actions'
import { Spin,Input,Form } from 'antd'
import io from 'socket.io-client';
if (process.env.NODE_ENV === 'production') {
	var socket = io('http://112.74.63.84/');
  } else {
	var socket = io('http://127.0.0.1/');
  }
const time = new Date()
class AsyncApp extends Component {
	constructor(props){
		super(props)
		this.handleMsgChange = this.handleMsgChange.bind(this)
		this.onMsgChange = this.onMsgChange.bind(this)
		this.state = {
			users:[],
			messages:[],
			socket,
			message:'',
			time: time.getMonth()+1+"月"+time.getDate()+1+"日" +" "+ ( time.getHours() < 10 ? '0'+time.getHours() : time.getHours() ) + ":" + (time.getMinutes() < 10 ? '0'+time.getMinutes() : time.getMinutes()),
		}
		this.ready(props.handleMember)
	}

	componentDidMount() {
		const { dispatch } = this.props
		dispatch(inputSubreddit('/list'))
		dispatch(fetchGetsIfNeeded('/list'))
	}

	onMsgChange(e){
		this.setState({
			message:e.target.value
		})
	}

	handleMsgChange(e){
		e.preventDefault()
	  	const { dispatch } = this.props
		this.state.socket.emit('send message',{msg:this.state.message,time:this.state.time});
		this.setState({
			message:'',
		})
	}

	ready(handleMember){
		var _this = this;
		this.state.socket.on('get users', function (users) {
			_this.setState({
				users
			})
		});
		this.state.socket.on('send message', function (msg) {
			let messages = _this.state.messages
			messages = messages.concat(msg)
			_this.setState({
				messages
			})
		})
	}
	
	render() {
		const { posts,isFetching } = this.props
		const {display,messages,userName,message,users} = this.state
		posts.userName ? this.state.socket.emit('login', posts.userName) : ''
		return (
			<div style={{opacity: isFetching ? 0.5:1}}>
				<h1>聊天室(共{users.length}人)</h1>
				<ul>
					<li><h1>成员：</h1></li>
					{users.map((user,i) => (
						<li key={i}>{user}</li>
					))}
				</ul>
				<br/>
				{isFetching && posts.length === 0 && <h2>Loading...</h2>}
				{!isFetching && messages.length === 0 && posts.length === 0 && <h2>Empty.</h2>}
				<ul id="messages" >
					{posts.length > 0 && 
						posts.map((post, i) => (
							<li key={i}>
								<strong>{post.userName}</strong> {": " + post.message + "(" + post.time+")"}
							</li>
						))
					}
					{messages.length > 0 && 
						messages.map((post, i) => (
							<li key={i}>
								<strong>{post.userName}</strong> {": " + post.message + "(" + post.time+")"}
							</li>
						))
					}
				</ul>
				<Form style={{display: !display ? 'block':'none'}} onSubmit={this.handleMsgChange}>
					<Input placeholder='chat content' value={message} onChange={this.onMsgChange} autoComplete="off" />
				</Form>
			</div>
		)
	}
}

function mapStateToProps(state) {
	const { inputSubreddit, postsBySubreddit } = state
	const {
		isFetching,
		items: posts
	} = postsBySubreddit[inputSubreddit] || {
		items: [],
		isFetching:true
	}
	return {
		inputSubreddit,
		isFetching,
		posts
	}
}

export default connect(mapStateToProps)(AsyncApp)