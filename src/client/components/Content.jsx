// pkg
import React, { Component } from 'react'
import { Avatar, Icon,Spin,Layout } from 'antd'
import { inject, observer } from "mobx-react"
import moment from 'moment-timezone/builds/moment-timezone.min';
import debounce from "lodash.debounce";

// local
import config from "../../../config/project.js";
import SublimeText from './SublimeText.jsx'
import RoomDetails from './RoomDetails.jsx'
import {
	emoji,
	colorList,
} from '../../../config/client.js'

// app
const {Content} = Layout

@inject("store")
@observer
export default class content extends Component {
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
		if(!myInfo.github.name){
			allHold("myInfo.groups",[{
				group_id:'',
				group_name:match.params.group_name,
				avatar_url:"https://assets.suisuijiang.com/group_avatar_default.jpeg?imageView2/2/w/40/h/40"
			}])
		}
		allHold("doing",true)
		socket({
			url: 'init group',
			group_name: match.params.group_name
		})
		let paste_file = e => {
			var clipboardData = e.clipboardData || window.clipboardData,
				i = 0,
				items,
				item,
				types;
			if( clipboardData ) {
				items = clipboardData.items;
				if( !items ) {
					return;
				}
				item = items[0];
				types = clipboardData.types || [];
				for(i = 0; i < types.length; i++ ) {
					if( types[i] === 'Files' ) {
						item = items[i];
						break;
					}
				}
				if( item && item.kind === 'file' && item.type.match(/^image\//i) ) {
					var blob = item.getAsFile();
					let form = new FormData()
					form.append("images", blob )
					fetch('/upload', {
						method: 'POST',
						body: form
					}).then(
						res => res.json()
					).then(
						json => {
							json.map(image=>{
								this.handleMsgSubmit({
									image,
									type:'image'
								})
							})
						}
					)
				}
			}
		}
		document.addEventListener('paste', paste_file, false)
	}
	componentWillReceiveProps(nextProps){
		const{ socket,allHold } = this.props.store
		if (nextProps) {
			
		}
		allHold("group.messageList",[])
		allHold("doing",true)
		socket({
			url: 'init group',
			group_name: nextProps.match.params.group_name
		})
	}

	handleMsgSubmit = (e) => {
		const {
			myInfo ,
			group,
			scrollToBottom,
			allHold
		} = this.props.store
		if(!e.text && !e.code && !e.image){return}
		this.props.store.socket({
			url: 'send message',
			group_name: group.group_name,
			group_id:group._id,
			user_id: myInfo.user_id,
			name: myInfo.github.name,
			avatar_url: myInfo.github.avatar_url,
			text : e.text,
			code: e.code,
			image: e.image,
			type: e.type,
		})
		this._textInput.value = ''
		allHold('showCodeEdit',false)
		allHold('showEmoji',false)
	}

	handleImage = (e) => {
		let input = document.createElement('input')
		input.type='file'
		input.multiple=true
		input.click()
		input.addEventListener('change', (e)=>{
			let form = new FormData()
			Array.from(e.target.files)
				.filter(file => file.type&&file.type.split('/')[0]=='image')
				.map((file,i)=>{
					form.append("images", file,file.name )
				})
			fetch('/upload', {
			  method: 'POST',
			  body: form
			}).then(
				res => res.json()
			).then(
				rep => {
					rep.map(image=>{
						this.handleMsgSubmit({
							image,
							type:'image'
						})
					})
				}
			)
			input.remove()
		}, false)
	}

	scrollToBottom = (data) => {
		this.messagesEnd.scrollIntoView(data)
	}
	render() {
		const { match } = this.props
		const { scrollToBottom, group,allHold , doing , myInfo ,showEmoji } = this.props.store;
		if (scrollToBottom) {
			this.scrollToBottom({
				behavior: 'auto',
			});
			allHold('scrollToBottom',false)
		}
		return (
			<Content 
				ref={(c) => this._content = c}
				refs="content"
				style={{overflow: 'initial' }} 
				className='content' 
				key={match.params.group_name}>
				<RoomDetails/>
				<div className='contentMessages'>
					{doing && <Spin className='contentMessagesWait'/>}
					{group.messageList.map((post, i) => (
						<div className={`contentMessagesList ${post.user_name == myInfo.github.name ? 'me' : 'other'}`} key={i}>
							<Avatar 
								data-id={post.user_id} 
								src={post.avatar_url} 
								id="showMoreUserInfo" 
								className='avatar' 
								shape="square"
								size="large"/>
							<div className='containerContent'>
								<p className='messageTittle'>
									<span className='nameContainer'>
										{post.user_name}
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
									style={{overflow:"auto"}}
									className={`${post.type} messageContainer`}>
										<code className="language-jsx">
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
					myInfo.github.name && <div className="contentFeature">
						<Icon className = 'emojiClick' id='emojiClick' type = 'smile-o'/>
						<div id="emojiContainer" className={showEmoji ? 'emojiContainer display' : 'emojiContainer none'}>
							{emoji.split(' ').map((index,i)=>(
								<span key={i} className = "emoji">{index}</span>
							))}
						</div>
						<Icon className='picture' type="picture" onClick={this.handleImage} />
						<span className = 'codingClick'>&lt;/></span>
						<SublimeText handleMsgSubmit={this.handleMsgSubmit}/>
					</div>
				}
				{
					myInfo.github.name && <form className='contentMessagesInputArea' onSubmit={(e)=>{
						e.preventDefault();
						this.handleMsgSubmit({
							type:'text',
							text:this._textInput.value
						})
					}}>
						<input
							ref={(c) => this._textInput = c}
							className='contentMessagesInput'
							id='contentMessagesInput'
							placeholder='chat content' />
					</form> 
				}
				{
					!myInfo.github.name && <div className='contentFeature'>
						<h2>
							请登录
							<a href={`https://github.com/login/oauth/authorize?client_id=${config.githubClientID}`}>github</a>
						</h2>
					</div>
				}
			</Content>
		)
	}
}
