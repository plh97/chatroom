import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  fetchPostsIfNeeded,
  inputSubreddit
} from '../actions'
import { Button,Icon,Row,Col,Form,Input,Spin,Textarea } from 'antd'
import $ from 'jquery'
var socket = io();
let users=[]

socket.on('new message', function(data){
	console.log(data)
	$('#messages').append($('<li>').html("<strong>"+data.user+"</strong>"+': '+data.msg.message+"("+data.msg.time+")"));
});	

socket.on('get users',function(data){
	console.log("get users: ",data)
	$("#users").html(
		data.map((text,i)=> (
			"<li>"+text+"</li>"
		))
	)
})

socket.on('new user', function(data){
	console.log("new user:",data)
});	

class AsyncApp extends Component {
	constructor(props){
		super(props)
		this.handleChange = this.handleChange.bind(this)
		this.onChange = this.onChange.bind(this)
		this.onNameChange = this.onNameChange.bind(this)
		this.handleLogin = this.handleLogin.bind(this)
		this.state={
			users:[],
			userName:'',
			message:'',
			time:new Date(),
			display:true
		}
	}

	componentDidMount() {
	  const { dispatch, inputSubreddit } = this.props
	  dispatch(fetchPostsIfNeeded(inputSubreddit))
	}

	onChange(e){
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
		// console.log(this.state.userName)
		socket.emit('new user',this.state.userName,function(data){
			if(data){
				console.log("successful Login")
			}
		});
		this.setState({
			users:users,
			userName:'',
			display:false
		})
	}

	handleChange(e){
		e.preventDefault()
	  	const { dispatch } = this.props
		dispatch(inputSubreddit(this.state.message))
		dispatch(fetchPostsIfNeeded(this.state.message))
		socket.emit('send message',this.state);
		this.setState({
			message:'',
		})
		return false;
	}

	render() {
		const { posts,isFetching } = this.props
		const {display} = this.state
		return (
			<Row gutter={48} align={'middle'} justify={'middle'} style={{opacity: isFetching ? 0.5:1}}>
				<ul>
					{users.map((user,i) => (
						<li key={i}>{user}</li>
					))}
				</ul>
				<Form style={{display: display ? 'block':'none'}} onSubmit={this.handleLogin}>
					<label>userName</label>
					<Input placeholder="userName" id="userName" value={this.state.userName} onChange={this.onNameChange} autoComplete="off" />
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
				</ul>
				<Form onSubmit={this.handleChange}>
					<Input placeholder='chat content' value={this.state.message} onChange={this.onChange} autoComplete="off" />
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