import React, { Component } from 'react'
import { Avatar, Icon } from 'antd'
import SublimeText from './SublimeText.jsx'
import RoomDetails from './RoomDetails.jsx'
import Prismjs from "prismjs"
import "prismjs/components/prism-jsx.js"
import "prismjs/themes/prism-okaidia.css"
import { inject, observer } from "mobx-react"
import {colorList,emoji} from '../../../config/client.js'
import { userInfo } from 'os';
import config from "../../../config/server.js";
// import moment from 'moment/min/moment.min';
// import moment from 'moment-timezone/builds/moment-timezone-with-data.min';
import moment from 'moment-timezone/builds/moment-timezone.min';

@inject("store")
@observer
export default class BodyContent extends Component {
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
		const{ socket,myInfo,allHold } = this.props.store
		const {match} = this.props
		document.cookie = `redirect_uri=${match.url};Path=/auth`;
		console.log('这个时候我开始给后台发送初始化群的请求。。后台什么时候才能返回给我？？？？');
		if(!myInfo.github.name){
			//根据url匹配规则匹配该默认群
			allHold("myInfo.groups",[{
				name:match.params.groupName,
				avatar_url:"https://assets.suisuijiang.com/group_avatar_default.jpeg?imageView2/2/w/40/h/40"
			}])
		}
		//不论游客有咩有登录，都要向后台发送初始化群消息的信息
		socket({
			url: 'init group',
			groupName: match.params.groupName
		})
		this.scrollToBottom('auto');
	}

	componentDidUpdate(){
		Prism.highlightAll()
	}

	handleMsgSubmit = (e) => {
		const {
			myInfo ,
			group
		} = this.props.store
		//如果发的内容为空,退出函数
		//text && code && messageImage
		if(!e.text && !e.code && !e.image){return}
		this.props.store.socket({
			url: 'send message',
			group: group.name,
			group_id:group._id,
			id: myInfo._id,
			name: myInfo.github.name,
			avatar_url: myInfo.github.avatar_url,
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
		const { group , doing , myInfo ,showEmoji , showEmojiFunc } = this.props.store;
		return (
			<div className='bodyContent'>
				<RoomDetails/>
				<div className='bodyContentMessages'>
					{group.messageList.map((post, i) => (
						<div className={`bodyContentMessagesList ${post.name == myInfo.github.name ? 'me' : 'other'}`} key={i}>
							<Avatar id="showMoreUserInfo" data-id={post.id} className='avatar' src={post.avatar_url} size="large">
								{post.name.split("")[0]}
							</Avatar>
							<div className='content'>
								<p className='messageTittle'>
									<span className='nameContainer'>
										{post.name}
									</span>
									<span className="timeContainer">
										{
											moment(post.create_time).format(`MMM Do , HH:mm:ss`)
										}
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
				{
					myInfo.github.name && <div className="bodyContentFeature">
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
				}
				{
					myInfo.github.name && <form className='bodyContentMessagesInputArea' onSubmit={(e)=>{
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
				}
				{
					!myInfo.github.name && <div className='bodyContentFeature'>
						<h2>
							请登录
							<a href={`https://github.com/login/oauth/authorize?client_id=${config.githubClientID}`}>github</a>
						</h2>
					</div>
				}
			</div>
		)
	}
}
