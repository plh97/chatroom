import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
	fetchGetsIfNeeded,
	inputSubreddit
} from '../actions'
import { Spin,Input,Form,Avatar,Layout,Col,Row,Menu,Icon } from 'antd'
const { Header, Content, Footer,Sider } = Layout;
import io from 'socket.io-client';
if (process.env.NODE_ENV === 'production') {
	var socket = io('http://112.74.63.84/');
} else {
	var socket = io('http://127.0.0.1/');
}
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae','#712704','#04477c','#1291a9','#000','#036803'];
const time = new Date()
class AsyncApp extends Component {
	constructor(props){
		super(props)
		this.handleMsgChange = this.handleMsgChange.bind(this)
		this.onMsgChange = this.onMsgChange.bind(this)
		this.state = {
			users:[],
			myName:document.cookie.split(';')[1].split('=')[1],
			messages:[],
			color: colorList,
			socket,
			message:'',
			time: time.getMonth()+1+"月"+time.getDate()+1+"日" +" "+ ( time.getHours() < 10 ? '0'+time.getHours() : time.getHours() ) + ":" + (time.getMinutes() < 10 ? '0'+time.getMinutes() : time.getMinutes()),
		}
		this.ready()
	}

	componentDidMount() {
		const { dispatch } = this.props
		dispatch(inputSubreddit('/list'))
		dispatch(fetchGetsIfNeeded('/list'))
	}

	// componentWillReceiveProps(){
	// 	console.log('componentWillReceiveProps')
	// }
	// // shouldComponentUpdate(){
	// // 	console.log('shouldComponentUpdate')
	// // }
	// componentWillUpdate(){
	// 	console.log('componentWillUpdate')
	// }
	componentDidUpdate(){
		console.log('componentDidUpdate')
		var ex = document.getElementById("messages");          
		ex.scrollTop = ex.scrollHeight;
	}

	// componentWillUnmount(){
	// 	console.log('componentWillUnmount')
	// }
	// componentWillMount(){
	// 	console.log('componentWillMount')
	// }

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
			message:''
		})
	}
	ready(){
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
		const { myName,display,messages,message,users } = this.state
		posts.userName ? this.state.socket.emit('login', posts.userName) : ''
		return (
			<Layout className="layout" >
				<Header>
					<h1>Web聊天室(共{users.length}人)</h1>
				</Header>
				<Layout>
					<Sider>
						<Row justify="start">
							<Col xs={{ span: 12, offset: 4 }}>
								<h2>成员：</h2>
							</Col>
						</Row>
							{users.map((user,i) => (
								<Row gutter={16} type="flex" justify="start" align="middle" key={i}>
									<Col xs={{ span: 5, offset: 7 }}>
										<Avatar shape="square" style={{ backgroundColor: this.state.color[user.charCodeAt() % 8]}}>{user.split('')[0]}</Avatar>
									</Col>
									<Col>{user}</Col>
								</Row>
							))}
					</Sider>
					<Content style={{opacity: isFetching ? 0.5:1}}>
						<Layout id='messages' className='messages'>
							{isFetching && posts.length === 0 && <h2><Spin/></h2>}
							{posts.length > 0 && 
								posts.map((post, i) => (
									<div className='messagesList' key={i}>
										<Row gutter={16} type="flex" justify={myName==post.userName ? "end" : 'start'} align="top">
											<Col style={{textAlign: myName==post.userName ? "left" : 'right'}} order={myName==post.userName?2:1} xs={{ span: 2 }}>
												<Avatar shape="square" style={{ backgroundColor: this.state.color[post.userName.charCodeAt() % 8] }} size="large">{post.userName.split("")[0]}</Avatar>
											</Col>
											<Col  style={{textAlign: myName==post.userName ? "right" : 'left'}} order={myName==post.userName?1:2} xs={{ span: 16 }}>
												<p>
													<span className='nameContainer'>
														{post.userName}
													</span>
													<span className="timeContainer">
														{post.time}
													</span>
												</p>
												<p className='messageContainer'>
													{post.message}
												</p>
											</Col>
										</Row>
									</div>
								))
							}
							{messages.length > 0 && 
								messages.map((post, i) => (
									<div className='messagesList' key={i}>
										<Row gutter={16} type="flex" justify={myName==post.userName ? "end" : 'start'} align="top" >
											<Col style={{textAlign: myName==post.userName ? "left" : 'right'}} order={myName==post.userName?2:1} xs={{ span: 2 }}>
												<Avatar shape="square" style={{ backgroundColor: this.state.color[post.userName.charCodeAt() % 8] }} size="large">{post.userName.split("")[0]}</Avatar>
											</Col>
											<Col  style={{textAlign: myName==post.userName ? "right" : 'left'}} order={myName==post.userName?1:2} xs={{ span: 16 }}>
												<p>
													<span className='nameContainer'>
														{post.userName}
													</span>
													{post.time}
												</p>
												<p className='messageContainer'>
													{post.message}
												</p>
											</Col>
										</Row>
									</div>
								))
							}
						</Layout>
						<Form className='messageInputArea' onSubmit={this.handleMsgChange}>
							<Input className='messageInput' placeholder='chat content' value={message} onChange={this.onMsgChange} autoComplete="off" />
						</Form>
					</Content>
				</Layout>
			</Layout>
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