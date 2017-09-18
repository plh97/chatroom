import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
	fetchGetsIfNeeded,
	fetchPostsIfNeeded,
	inputSubreddit
} from '../actions'
import { Spin, Input, Form, Avatar, Layout, Col, Row, Icon,Button,Menu } from 'antd'
const { Header, Content, Footer,Sider } = Layout;
import io from 'socket.io-client';
console.log('process.env.NODE_ENV: ',process.env.NODE_ENV)
const socket = io(process.env.NODE_ENV === 'production' ? 'http://112.74.63.84:8080/' : 'http://127.0.0.1:8080/');
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae','#712704','#04477c','#1291a9','#000','#036803'];
import Emoji from '../assets/emoji/Emoji.js'
import AutoFuncArea from '../components/AutoFuncArea.jsx'
const emoji = Emoji.split(' ')

import Highlight from 'react-highlight'
import 'highlight.js/styles/tomorrow-night-eighties.css'

class AsyncApp extends Component {
	constructor(props){
		super(props)
		this.handleMsgChange = this.handleMsgChange.bind(this)
		this.handleImage = this.handleImage.bind(this)
		this.state = {
			users:[],
			documentCookie:{},
			messages:[],
			color: colorList,
			page:1,
			files:'',
			clientWidth:document.body.clientWidth,
			collapsed: document.body.clientWidth < 500 ? true:false,
			emojiClick:false,
			codingClick:false,
			messagesHistory:[],
			size:0,
			socket,
		}
		this.ready()
	}

	componentDidMount() {
		//only init to callback
		const { dispatch } = this.props
		dispatch(inputSubreddit('/list'))
		this.state.socket.emit('get list')
		dispatch(fetchGetsIfNeeded('/list'))
		this.nameInput.focus();
	}

	componentDidUpdate(){
		//callback while need to render
		const { documentCookie } = this.state
		//to new state of cookies
		document.cookie.split(';').map((index,i)=>{
			documentCookie[index.split("=")[0].split(" ").join('')] = index.split("=")[1]
		})
		this.initScrollHeight()
	}

	scroll = (e) => {
		let _this = this;
		if(e.target.scrollTop == 0){
			console.log('到顶了。。准备加载更多');
			_this.setState({
				page:_this.state.page+1
			})
		}
	}

	initScrollHeight = (e) => {
		let ex = document.getElementById("messages");
		if(ex.scrollHeight - ex.scrollTop < 2000){
			ex.scrollTop = ex.scrollHeight;
		}else{
			console.log("你可能在看历史消息", ex.scrollTop , ex.scrollHeight)
		}
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
				this.state.socket.emit('send message',{
					size:this.state.files.size,
					imageUrl:success.data.url,
					avatorUrl:this.state.documentCookie.avatorUrl,
					type:'image'
				});
			}
		)
	}

	handleAllEventClick = (e) => {
		//判断有一些事件是否触发发图片
		console.log(e.target.className)
		switch (e.target.className){
			case 'emoji':
				document.getElementById('bodyContentMessagesInput').value += e.target.innerText
				this.nameInput.focus();
				break;
			case 'anticon anticon-picture picture':
				document.querySelector('#imgInputFile').click()
				break;
			case 'anticon anticon-menu-unfold trigger':
				this.setState({
					collapsed: !this.state.collapsed,
				})
				break;
			case 'anticon anticon-menu-fold trigger':
				this.setState({
					collapsed: !this.state.collapsed,
				})
				break;
			default:
		}
		//判断一些是否添加emoji
		//完整了，不能在这里添加
		switch (e.target.className){
			//切换emoji是否显示
			case 'anticon anticon-smile-o emojiClick':
				this.setState({
					emojiClick : true
				})
				break;
			case 'emoji':
				this.setState({
					emojiClick : true
				})
				break;
			default:
				this.setState({
					emojiClick : false
				})
		}
		//判断一些是否显示coding
		//完整了，不能在这里添加
		switch (e.target.className){
			//切换emoji是否显示
			case 'codingClick':
				this.setState({
					codingClick : true
				})
				break;
			case 'ant-input textArea':
				this.setState({
					codingClick : true
				})
				break;
			default:
				this.setState({
					codingClick : false
				})
		}
	}

	handleAvatorChange = (e) =>{
		var data = new FormData()
		let { documentCookie } = this.state
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
				this.state.socket.emit('change avator',
					{ 
						avatorUrl : success.data.url, 
						userName : documentCookie.userName
					}
				);
				document.cookie = 'avatorUrl=' + success.data.url
				this.state.socket.emit('get list')
			}
		)
	}

	handleMsgChange(e){
		const {documentCookie} = this.state
		//如果消息为空，不发送消息
		if(e.coding){
			this.state.socket.emit(
				'send message',
				{
					code:e.coding,
					avatorUrl:documentCookie.avatorUrl,
					type:'code'
				}
			);
			this.setState({
				codingClick:false
			})
			return
		}
		if(!document.getElementById('bodyContentMessagesInput').value){return}
		this.state.socket.emit(
			'send message',
			{
				msg:document.getElementById('bodyContentMessagesInput').value,
				avatorUrl:documentCookie.avatorUrl,
				type:'content'
			}
		);
		document.getElementById('bodyContentMessagesInput').value = ''
		this.setState({
			emojiClick:false
		})
		document.getElementById('bodyContentMessagesInput').focus()
		e.preventDefault()
	}
	ready(){
		var _this = this;
		this.state.socket.on('get users', function (users) {
			_this.setState({
				users
			})
		});
		this.state.socket.on('get list', function (messagesHistory) {
			_this.setState({
				messagesHistory
			})
		});
		this.state.socket.on('send message', function (msg) {
			let messages = _this.state.messages
			messages = messages.concat(msg)
			_this.setState({
				messages,
				size:msg.size
			})
			if(msg.userName !== _this.state.documentCookie.userName){
				Notification.requestPermission(function(perm){
					if(perm == "granted"){
						var notification = new Notification(msg.userName+' - 发来消息： ',{
							dir:'auto',
							tag:'testTag',
							renotify:false,
							body:msg.message ? msg.message : msg.code,
							icon:msg.avatorUrl,
							image:msg.imageUrl,
						})
					}
				})
			}
		})
	}

	render() {
		const { posts,isFetching } = this.props;
		const { messagesHistory, documentCookie,display,messages,message,users,page ,collapsed,clientWidth } = this.state;
		posts.userName ? this.state.socket.emit('login', posts) : '';
		console.log(this.state.codingClick)

		return (
			<Layout className="layout" onClick = {this.handleAllEventClick}>
				<Header>
					<Icon className="trigger" type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}/>
					<h1>Web聊天室(共{users.length}人)</h1>
				</Header>
				<Layout className="body">
					<Sider 
						trigger={null}
						collapsible
						style={{display:collapsed?'none':'block'}}
						collapsed={collapsed}
						className='bodySlider'>	
						<Row justify="start">
							<Col xs={{ span: 12, offset: 4 }}>
								<h2>成员：</h2>
							</Col>
						</Row>
						{users.map((user,i) => (
							<Row gutter={16} type="flex" justify="start" align="middle" key={i}>
								<Col xs={{ span: 5, offset: 7 }}>
									<Avatar 
										src={user.avatorUrl}
										className="slideAvator"
										icon='picture'
										size="large"
										onClick={()=>{
											user.userName==documentCookie.userName ? document.getElementById('avatorInputFile').click():''
										}}
										style={{
											cursor: user.userName==documentCookie.userName?'pointer':'auto',
											backgroundColor: this.state.color[user.userName.charCodeAt() % 8]
										}}
									>
									</Avatar>
									{user.userName == documentCookie.userName ? <input 
										style={{display:'none'}} 
										onChange={this.handleAvatorChange} 
										value={this.state.file} 
										id='avatorInputFile' 
										className='avatorInputFile' 
										type="file" />:""
									}
								</Col>
								<Col>
									<strong>{user.userName}</strong>
								</Col>
							</Row>
						))}
					</Sider>
					<Content className='bodyContent' style={{opacity: isFetching ? 0.5:1}}>
						<Layout id='messages' className='bodyContentMessages' onScroll={this.scroll}>
							<div className="messagesHistory">
								<h1><Spin/></h1>
								{messagesHistory.length > 0 && 
									messagesHistory.slice(messagesHistory.length-30*page,messagesHistory.length).map((post, i) => (
										<div className='bodyContentMessagesList' key={i}>
											<Row gutter={16} 
												type="flex" 
												justify={documentCookie.userName==post.userName ? "end" : 'start'} 
												align="top">
												<Col style={{
													textAlign: documentCookie.userName==post.userName ? "left" : 'right'
												}} 
													order={documentCookie.userName==post.userName?2:1} 
													xs={{ span: clientWidth > 500 ? 2:4 }}>
													<Avatar
														style={{ 
															backgroundColor: this.state.color[post.userName.charCodeAt() % 8] 
														}}
														src={post.avatorUrl}
														size="large">{post.userName.split("")[0]}
													</Avatar>
												</Col>
												<Col style={{
														textAlign: documentCookie.userName==post.userName ? "right" : 'left'
													}} 
													order={documentCookie.userName==post.userName?1:2} 
													xs={{span: 16}}>
													<p>
														<span className='nameContainer'>
															{post.userName}
														</span>
														<span className="timeContainer">
															{post.time}
														</span>
													</p>
													<p className = 'messageContainer'
														style = {{background : post.code ? '#2d2d2d' : '' }}
														>
														{post.message}
														{post.imageUrl ? <img 
															className = 'imageContainer' 
															src = {post.imageUrl}/> : ''}
														{post.code ? <Highlight 
															className = 'JavaScript'>
															{post.code}
														</Highlight> : ''}
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
												justify={documentCookie.userName==post.userName ? "end" : 'start'} 
												align="top" >
												<Col style={{
													textAlign: documentCookie.userName==post.userName ? "left" : 'right'
												}}
													order={documentCookie.userName==post.userName?2:1} 
													xs={{ span: clientWidth > 500 ? 2:4 }}>
													<Avatar 
														style={{
															backgroundColor: this.state.color[post.userName.charCodeAt() % 8] 
														}} 
														src={post.avatorUrl}
														size="large">
														{post.userName.split("")[0]}
													</Avatar>
												</Col>
												<Col style={{
													textAlign: documentCookie.userName==post.userName ? "right" : 'left'
												}} 
													order={documentCookie.userName==post.userName?1:2} 
													xs={{span:16}}>
													<p>
														<span className='nameContainer'>
															{post.userName}
														</span>
														<span className="timeContainer">
															{post.time}
														</span>
													</p>
													<p className = 'messageContainer'
														style = {{background : post.code ? '#2d2d2d' : '' }}>
														{post.message}
														{post.imageUrl ? <img 
															onLoad = {this.initScrollHeight} 
															className = 'imageContainer' 
															src = {post.imageUrl}/> : ''}
														{post.code ? <Highlight 
															className = 'JavaScript'>
															{post.code}
														</Highlight> : ''}
													</p>
												</Col>
											</Row>
										</div>
									))
								}
							</div>
						</Layout>
						<div className="bodyContentFeature">
							<Icon className = 'emojiClick' type = 'smile-o'/>
							<div className={this.state.emojiClick ? 'emojiContainer display' : 'none emojiContainer'}>
								{emoji.map((index,i)=>(
									<span className = "emoji">{index}</span>
								))}
							</div>
							<Icon className='picture' type="picture"/>
							<input onChange={this.handleImage} 
								value={this.state.file} 
								id='imgInputFile'
								className='imgInputFile'
								type="file" />
							<span className = 'codingClick'>&lt;/></span>
							<AutoFuncArea 
								codeClick = {this.state.codingClick} 
								handleMsgChange = {this.handleMsgChange}/>
						</div>
						<Form className='bodyContentMessagesInputArea' onSubmit={this.handleMsgChange}>
							<Input 
								className='bodyContentMessagesInput' 
								id='bodyContentMessagesInput' 
								ref={ input => {
									this.nameInput = input; 
								}}
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