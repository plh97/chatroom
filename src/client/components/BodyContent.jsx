import React, { Component } from 'react'
import { Spin, Input, Avatar, Icon,Button } from 'antd'
import io from 'socket.io-client';
import Emoji from '../assets/emoji/Emoji.js'
import AutoFuncArea from '../components/AutoFuncArea.jsx'
import Highlight from 'react-syntax-highlighter'
import { tomorrowNightEighties } from 'react-syntax-highlighter/dist/styles';
import { inject, observer } from "mobx-react"
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae','#712704','#04477c','#1291a9','#000','#036803'];
const emoji = Emoji.split(' ')
const socket = io(process.env.NODE_ENV === 'production' ? 'http://112.74.63.84/' : 'http://127.0.0.1:8080/');

@inject("store")
@observer
export default class AsyncApp extends Component {
	constructor(props){
		super(props)
		this.state = {
			color: colorList,
			files:'',
			emojiClick:false,
			codingClick:true,
			size:0,
			type:"text",
			socket,
			url:'send message',
		}
	}
	//只在初始化的时候只执行一次
	componentDidMount() {
		//获取该房间历史消息记录
		this._textInput.focus();
	}

	handleMsgSubmit = (e) => {
		//如果发的内容为空,退出函数
		//text && code && messageImage
		console.log(e)
		if(!e.text && !e.code && !e.image){return}
		this.props.store.socket({
			url:'send message',
			userId: this.props.store.userId,
			myName: this.props.store.myName,
			nowRoom: this.props.store.nowRoom,
			myAvatorUrl: this.props.store.myAvatorUrl,
			//3种信息类型，文字，代码，图片
			text : e.text,
			code: e.code,
			image: e.image,
			type: e.type,
		})
		this._textInput.value = ''
	}

	handleImage = (e) => {
		let data = new FormData()
		data.append("smfile", e.target.files[0])
		fetch('https://sm.ms/api/upload', {
		  method: 'POST',
		  body: data
		}).then(
			response => response.json()
		).then(
			success => {
				this.handleMsgSubmit({
					image: success.data,
					type:'image'
				})
			}
		)
	}

	render() {
		const { match } = this.props
		const { nowRoomFunc, messagesList,doing,myName } = this.props.store;
		return (
			<div className='bodyContent'>
				<div className='bodyContentMessages'>
					{messagesList.map((post, i) => (
						<div
							className={`bodyContentMessagesList ${post.userName==myName ? 'me' : 'other'}`} 
							key={i}>
							<Avatar
								className='avator'
								style={{ 
									backgroundColor: this.state.color[post.userName.charCodeAt() % 8] 
								}}
								src={post.avatorUrl}
								size="large">{post.userName.split("")[0]}
							</Avatar>
							<div className='content'>
								<p style={{
									textAlign:'right'
								}}>
									<span className='nameContainer'>
										{post.userName}
									</span>
									<span className="timeContainer">
										{post.createTime}
									</span>
								</p>
								{post.text && <p className = {`messageContainer ${post.type}`}>
									{post.text}
								</p>}
								{post.image ? <img 
									className = {`messageContainer ${post.type}`} 
									style={{
										width : post.image.width
									}}
									src = {post.image.url}/> : ''}
								{post.code ? <div className={`${post.type} messageContainer`}><Highlight 
									language='javascript'
									style={tomorrowNightEighties}
									className ="JavaScript">
									{post.code}
								</Highlight></div> : ''}
							</div>
						</div>
					))}
				</div>
				<div className="bodyContentFeature">
					<Icon className = 'emojiClick' type = 'smile-o'/>
					<div className={this.state.emojiClick ? 'emojiContainer display' : 'none emojiContainer'}>
						{emoji.map((index,i)=>(
							<span key={i} className = "emoji">{index}</span>
						))}
					</div>
					<Icon className='picture' type="picture" onClick={()=>this._imageInput.click()}/>
					<input onChange={this.handleImage} 
						value={this.state.file} 
						ref={(c) => this._imageInput = c}
						id='imgInputFile'
						className='imgInputFile'
						type="file" />
					<span className = 'codingClick'>&lt;/></span>
					<AutoFuncArea 
						codeClick = {this.state.codingClick} 
						handleMsgSubmit = {this.handleMsgSubmit}/>
				</div>
				<form className='bodyContentMessagesInputArea' onSubmit={(e)=>{
					e.preventDefault();
					this.handleMsgSubmit({
						type:'text',
						text:this._textInput.value
					})
				}}>
					<input 
						ref={(c) => this._textInput = c}
						className='bodyContentMessagesInput' 
						id='bodyContentMessagesInput' 
						placeholder='chat content' />
				</form>
			</div>
		)
	}
}