import React, { Component } from 'react'
import { inject, observer } from "mobx-react"

@inject("store")
@observer
class Trigger  extends Component {
  //事件总代理模型
	//all event only Perform their own duties
	handleAllEventClick = (e) => {
		const {
			showRoomDetail ,
			showRoomDetailFunc ,
			showCodeEditFunc ,
			showCodeEdit ,
			showEmoji ,
			showEmojiFunc ,
			showMoreUserInfo,
			showMoreUserInfoFunc
		} = this.props.store
		//avator click
		//whether show avator details
		//如果点中的元素包含showMoreUserInfo,则显示
		let filterDOM = (dom) => {
			return e.nativeEvent.path.filter((index)=> {
				// e.preventDefault()
				return index.id==dom
			}).length > 0
		}
		//如果所点击的元素包括 => id = showMoreUserInfo
		if(filterDOM('showMoreUserInfo')){
			//当你点击的仅仅只是头像的时候
			showMoreUserInfoFunc({
				isShow:true,
				x: e.nativeEvent.view.innerWidth - e.nativeEvent.x - 220 >0 ? e.nativeEvent.x : e.nativeEvent.x - 220,
				y: e.nativeEvent.view.innerHeight - e.nativeEvent.y - 335 >0 ? e.nativeEvent.y : e.nativeEvent.y - 335,
				name:e.nativeEvent.path.filter((index)=> {
					e.preventDefault()
					return index.id=='showMoreUserInfo'
				})[0].innerText,
				avatorUrl:'e.nativeEvent',
			})
		}else if(filterDOM('showMoreUserInfo')){
			// showEmojiFunc(true)
		}else{
			showMoreUserInfoFunc({
				isShow:false,
				// x: 0,
				// y: 0,
				name:'',
				avatorUrl:''
			})
		}
		//是否显示房间细节
		if(e.nativeEvent.path.filter((index)=> {
			return index.className=='toggleDetail'
		}).length > 0){
			showRoomDetailFunc(!showRoomDetail)
		}else if( e.nativeEvent.path.filter((e)=> e.id=='bodyContentRoomDetails' || e.id=='showMoreUserInfoContainer' ).length > 0 ){
			//
		}else{
			showRoomDetailFunc(false)
		}
		//是否显示代码编辑器
		if(e.nativeEvent.path.filter((index)=> {
			return index.className=='codingClick'
		}).length > 0){
			showCodeEditFunc(!showCodeEdit)
		}else if(
			e.nativeEvent.path.filter((index)=> {
				return index.id=='textArea'
			}).length > 0
		){}else{
			showCodeEditFunc(false)
		}
		//是否显示Emoji
		if(e.nativeEvent.path.filter((index)=> {
			return index.id=='emojiClick'
		}).length > 0){
			showEmojiFunc(!showEmoji)
		}else if(
			e.nativeEvent.path.filter((index)=> {
				return index.id=='emojiContainer'
			}).length > 0
		){
			if(e.nativeEvent.path[0].innerText.length==2){
				document.getElementById('bodyContentMessagesInput').value += e.nativeEvent.path[0].innerText
				document.getElementById('bodyContentMessagesInput').focus()
			}
		}else{
			showEmojiFunc(false)
		}
		//Switch Channel
		if(e.nativeEvent.path.filter((index)=> {
			return index.className=='roomList'
		}).length > 0){
			this.props.store.socket({
				url:'get currentRoomInfo',
				name:e.nativeEvent.path.filter((index)=> {
					return index.className=='roomList'
				})[0].id
			})
		}
	}

  render() {
    const {children} = this.props
    return (
      <div className={this.props.className} onClick={this.handleAllEventClick}>
        {children}
      </div>
    );
  }
}

export default Trigger;
