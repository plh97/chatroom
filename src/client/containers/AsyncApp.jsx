import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
	fetchGetsIfNeeded,
	fetchPostsIfNeeded,
	inputSubreddit
} from '../actions'
import { Spin, Input, Form, Avatar, Layout, Col, Row, Icon,Button } from 'antd'
const { Header, Content, Footer,Sider } = Layout;
import io from 'socket.io-client';
if (process.env.NODE_ENV === 'production') {
	var socket = io('http://112.74.63.84/');
} else {
	var socket = io('http://127.0.0.1/');
}
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae','#712704','#04477c','#1291a9','#000','#036803'];
let time = new Date();

class AsyncApp extends Component {
	constructor(props){
		super(props)
		this.handleMsgChange = this.handleMsgChange.bind(this)
		this.handleImage = this.handleImage.bind(this)
		this.state = {
			users:[],
			myName:document.cookie.split(';')[1].split('=')[1],
			messages:[],
			color: colorList,
			files:'',
			socket,
			time: time.getMonth()+1+"月"+time.getDate()+"日" +" "+ 
				( time.getHours() < 10 ? '0'+time.getHours() : time.getHours() ) +
				 ":" + (time.getMinutes() < 10 ? '0'+time.getMinutes() : time.getMinutes())
		}
		this.ready()
	}

	componentDidMount() {
		const { dispatch } = this.props
		dispatch(inputSubreddit('/list'))
		dispatch(fetchGetsIfNeeded('/list'))
	}

	componentDidUpdate(){
		setTimeout(()=>{
			var ex = document.getElementById("messages");
			ex.scrollTop = ex.scrollHeight;
			console.log(ex.scrollTop , ex.scrollHeight)
		},100)
		time = new Date();
	}

	handleImage(e){
		var data = new FormData()
		this.setState({
			files:e.target.files[0]
		})
		data.append("smfile", this.state.files)
		fetch('https://sm.ms/api/upload', {
		  method: 'POST',
		  body: data
		}).then(
			response => response.json()
		).then(
			success => {
				this.state.socket.emit('send message',{imageUrl:success.data.url,time:this.state.time});
			}
		).catch(
			error => console.log(error)
		);
		
	}

	handleMsgChange(e){
		e.preventDefault()
		//如果消息为空，不发送消息
		if(!document.getElementById('bodyContentMessagesInput').value){return}
		this.state.socket.emit(
			'send message',
			{msg:document.getElementById('bodyContentMessagesInput').value,time:this.state.time}
		);
		document.getElementById('bodyContentMessagesInput').value = ''
	}
	ready(){
		var _this = this;
		this.state.socket.on('get users', function (users) {
			_this.setState({
				users
			})
		});
		this.state.socket.on('send message', function (msg) {
			console.log(msg)
			let messages = _this.state.messages
			messages = messages.concat(msg)
			_this.setState({
				messages
			})
			if(msg.userName !== _this.state.myName){
				Notification.requestPermission(function(perm){
					if(perm == "granted"){
						var notification = new Notification(msg.userName+' - 发来消息： ',{
							dir:'auto',
							tag:'testTag',
							renotify:true,
							body:msg.message,
							// icon:"https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png",
							// image:msg.imageUrl,
						})
					}
				})
			}
		})
	}

	render() {
		const { posts,isFetching } = this.props;
		const { myName,display,messages,message,users } = this.state;
		posts.userName ? this.state.socket.emit('login', posts.userName) : '';

		return (
			<Layout className="layout" >
				<Header>
					<h1>Web聊天室(共{users.length}人)</h1>
				</Header>
				<Layout className="body">
					<Sider className='bodySlider'>
						<Row justify="start">
							<Col xs={{ span: 12, offset: 4 }}>
								<h2>成员：</h2>
							</Col>
						</Row>
						{users.map((user,i) => (
							<Row gutter={16} type="flex" justify="start" align="middle" key={i}>
								<Col xs={{ span: 5, offset: 7 }}>
									<Avatar 
										shape="square" 
										style={{ backgroundColor: this.state.color[user.charCodeAt() % 8]}}
									>
										{user.split('')[0]}
									</Avatar>

								</Col>
								<Col>{user}</Col>
							</Row>
						))}
					</Sider>
					<Content className='bodyContent' style={{opacity: isFetching ? 0.5:1}}>
						<Layout id='messages' className='bodyContentMessages'>
							<div className="messagesHistory">
								{isFetching && posts.length === 0 && <h2><Spin/></h2>}
								{posts.length > 0 && 
									posts.map((post, i) => (
										<div className='bodyContentMessagesList' key={i}>
											<Row gutter={16} 
												type="flex" 
												justify={myName==post.userName ? "end" : 'start'} 
												align="top">
												<Col style={{textAlign: myName==post.userName ? "left" : 'right'}} 
													order={myName==post.userName?2:1} xs={{ span: 2 }}>
													<Avatar shape="square" 
														style={{ backgroundColor: this.state.color[post.userName.charCodeAt() % 8] }} 
														size="large">{post.userName.split("")[0]}
													</Avatar>
												</Col>
												<Col style={{textAlign: myName==post.userName ? "right" : 'left'}} 
													order={myName==post.userName?1:2} xs={{ span: 16 }}>
													<p>
														<span className='nameContainer'>
															{post.userName}
														</span>
														<span className="timeContainer">
															{post.time}
														</span>
													</p>
													<p className='messageContainer'>
														{post.imageUrl ? <img className='imageContainer' src={post.imageUrl}/> : post.message }
													</p>
												</Col>
											</Row>
										</div>
									))
								}
							</div>
							<div className="messagesNews">
								{messages.length > 0 && 
									messages.map((post, i) => (
										<div className='bodyContentMessagesList' key={i}>
											<Row gutter={16} type="flex" 
												justify={myName==post.userName ? "end" : 'start'} 
												align="top" >
												<Col style={{textAlign: myName==post.userName ? "left" : 'right'}} 
													order={myName==post.userName?2:1} xs={{ span: 2 }}>
													<Avatar shape="square" 
														style={{ backgroundColor: this.state.color[post.userName.charCodeAt() % 8] }} 
														size="large">{post.userName.split("")[0]}</Avatar>
												</Col>
												<Col style={{textAlign: myName==post.userName ? "right" : 'left'}} 
													order={myName==post.userName?1:2} xs={{ span: 16 }}>
													<p>
														<span className='nameContainer'>
															{post.userName}
														</span>
														<span className="timeContainer">
															{post.time}
														</span>
													</p>
													<p className='messageContainer'>
														{post.imageUrl ? <img className='imageContainer' src={post.imageUrl}/> : post.message}
													</p>
												</Col>
											</Row>
										</div>
									))
								}
							</div>
						</Layout>
						<div className="bodyContentFeature">
							<Icon onClick={()=>document.querySelector('#imgInputFile').click()} className='picture' type="picture" style={{ fontSize: 32, color: '#fff' }} />
							<input onChange={this.handleImage} value={this.state.file} id='imgInputFile' className='imgInputFile' type="file" />
						</div>
						<Form className='bodyContentMessagesInputArea' onSubmit={this.handleMsgChange}>
							<Input 
								className='bodyContentMessagesInput' 
								id='bodyContentMessagesInput' 
								placeholder='chat content' />
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