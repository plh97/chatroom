import React, { Component } from 'react'
import { Avatar, Icon } from 'antd'
import SublimeText from './SublimeText.jsx'
import RoomDetails from './RoomDetails.jsx'
import Prismjs from "prismjs"
import "prismjs/components/prism-jsx.js"
import "prismjs/themes/prism-okaidia.css"
import { inject, observer } from "mobx-react"
import {colorList,emoji} from '../../../config/client.js'

@inject("store")
@observer
export default class AsyncApp extends Component {
	constructor(props){
		super(props)
		this.state = {
			files:'',
			emojiClick:false,
			codingClick:true,
			type:"text",
			url:'send message',
		}
	}

	componentDidMount() {
	  this.scrollToBottom('auto');
	}

	componentDidUpdate(){
		Prism.highlightAll()
	}

	handleMsgSubmit = (e) => {
		const {
			myInfo ,
			currentRoomInfo
		} = this.props.store
		//如果发的内容为空,退出函数
		//text && code && messageImage
		if(!e.text && !e.code && !e.image){return}
		this.props.store.socket({
			url: 'send message',
			userId: myInfo.id,
			myName: myInfo.name,
			nowRoom: currentRoomInfo.name,
			myAvatorUrl: currentRoomInfo.avatorUrl,
			//3种信息类型，文字，代码，图片
			text : e.text,
			code: e.code,
			image: e.image,
			type: e.type,
		})
		this._textInput.value = ''
		this.props.store.showCodeEditFunc(false)
		this.scrollToBottom('auto');
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

	scrollToBottom = (behave) => {
		setTimeout(()=>{
			this.messagesEnd.scrollIntoView({
				behavior: behave
			})
		},1)
	}

	render() {
		const { match } = this.props
		const { currentRoomInfo , doing , myInfo ,showEmoji , showEmojiFunc } = this.props.store;
		return (
			<div className='bodyContent'>
				<RoomDetails/>
				<div className='bodyContentMessages'>
					{currentRoomInfo.messageList.map((post, i) => (
						<div className={`bodyContentMessagesList ${post.userName == myInfo.name ? 'me' : 'other'}`} key={i}>
							<Avatar
								id="showMoreUserInfo"
								className='avator'
								style={{
									backgroundColor: colorList[post.userName.charCodeAt() % 8]
								}}
								src={post.avatorUrl}
								size="large">{post.userName.split("")[0]}
							</Avatar>
							<div className='content'>
								<p className='messageTittle'>
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
									onLoad={this.scrollToBottom.bind(this,'auto')}
									className = {`messageContainer ${post.type}`}
									style={{
										width : post.image.width
									}}
									src = {post.image.url}/> : ''}
								{post.code ? <pre
									style={{overflow:"visible"}}
									className={`${post.type} messageContainer`}>
										<code className="language-js">
											{post.code}
										</code>
									</pre> : ''}
							</div>
						</div>
					))}
	        <div style={{ float:"left", clear: "both" }}
	             ref={(el) => { this.messagesEnd = el; }}>
	        </div>
				</div>
				<div className="bodyContentFeature">
					<Icon className = 'emojiClick' id='emojiClick' type = 'smile-o'/>
					<div id="emojiContainer" className={showEmoji ? 'emojiContainer display' : 'emojiContainer none'}>
						{emoji.split(' ').map((index,i)=>(
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
					<SublimeText handleMsgSubmit={this.handleMsgSubmit}/>
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
