import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  fetchPostsIfNeeded,
  inputSubreddit
} from '../actions'
import { Row,Form,Input,Spin } from 'antd'
import io from 'socket.io-client';
var socket = io('http://127.0.0.1');
let messages = []
class AsyncApp extends Component {
	constructor(props){
		super(props)
		this.handleMsgChange = this.handleMsgChange.bind(this)
		this.onMsgChange = this.onMsgChange.bind(this)
		this.onNameChange = this.onNameChange.bind(this)
		this.handleLogin = this.handleLogin.bind(this)
		this.state={
			users:[],
			messages:props.posts,
			socket,
			userName:'',
			message:'',
			time:new Date().toLocaleString(),
			display:true
		}
		this.ready(props.handleMember)
	}

	componentDidMount() {
	  const { dispatch, inputSubreddit } = this.props
	  dispatch(fetchPostsIfNeeded(inputSubreddit))
	}

	onMsgChange(e){
		this.setState({
			message:e.target.value
		})
	}

	onNameChange(e){
		this.setState({
			userName:e.target.value
		})
	}
	handleLogin(e){
		e.preventDefault()
		this.state.socket.emit('login', this.state.userName);
		this.setState({
			userName:'',
			display:false
		})
	}

	handleMsgChange(e){
		e.preventDefault()
	  	const { dispatch } = this.props
		// dispatch(inputSubreddit(this.state.message))
		// dispatch(fetchPostsIfNeeded(this.state.message))
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
			handleMember(users.length)
		});
		this.state.socket.on('send message', function (msg) {
			messages.push(msg)
			_this.setState({
				messages
			})
		})
	}

	render() {
		const { posts,isFetching } = this.props
		const {display,messages,userName,message} = this.state
		return (
			<Row style={{opacity: isFetching ? 0.5:1}}>
				<ul>
					{this.state.users.map((user,i) => (
						<li key={i}>{user}</li>
					))}
				</ul>
				<br/>
				<Form style={{display: display ? 'block':'none'}} onSubmit={this.handleLogin}>
					<label>userName</label>
					<Input placeholder="userName" id="userName" value={userName} onChange={this.onNameChange} autoComplete="off" />
				</Form>
				{isFetching && posts.length === 0 && <h2>
					<Spin/>
				</h2>}
				{!isFetching && posts.length === 0 && <h2>Empty.</h2>}
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
			</Row>
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