import React, { Component } from 'react'
import { inject, observer } from "mobx-react"

@inject("store")
@observer
class Trigger extends Component {
	// constructor(props) {
	//   super(props);
	//   this.isMount = false;
	//   this.listeners = [];
	//   // this.onPopup = this._onPopup.bind(this);
	// }
	// isContains(root, node) {
	//   while(node) {
	//     if(root === node) {
	//       return true;
	//     }
	//     node = node.parentNode;
	//   }
	//   return false;
	// }
	// isFunction(func) {
	//   return typeof func === 'function';
	// }
	// onDocumentClick(event, callback) {
	//   const root = this.container;
	//   const target = event.target
	//   if(
	//     this.isMount &&
	//     this.isFunction(callback) &&
	//     !this.isContains(root, target)
	//   ) {
	//     callback(event);
	//   }
	// }
	// addEventListener(target, event, callback) {
	//   const cb = (e) => this.onDocumentClick(e, callback);
	//   if(target && target.addEventListener) {
	//     target.addEventListener(event, cb, false);
	//     return () => {target.removeEventListener(event, cb, false)};
	//   }
	// }
	//
	//
	// _onPopup(e, cb) {
	//   this.listeners.push(
	//     this.addEventListener(
	//       document,
	//       e,
	//       (event) => {
	//         this.isFunction(cb) && cb();
	//       }
	//     )
	//   )
	// }

	//事件总代理模型
	//all event only Perform their own duties
	handleAllEventClick = (e) => {
		// console.log(this.container);

		// this.listeners.map((func) => {
		//   this.isFunction(func) && func();
		// })
		// this._onPopup(
		//     'click',
		//     () => {console.log(123)}
		// )
		const {
			allHold,
			socket,
			showRoomDetail,
			showRoomDetailFunc,
			showCodeEditFunc,
			showCodeEdit,
			showEmoji,
			showEmojiFunc,
			showMoreUserInfo,
			showMoreUserInfoFunc,
			is_show_create_group_input_func
		} = this.props.store
		//avator click
		//whether show avator details
		//如果点中的元素包含showMoreUserInfo,则显示
		let filterDOM = (dom) => {
			return e.nativeEvent.path.filter((index) => {
				// e.preventDefault()
				return index.id == dom
			}).length > 0
		}
		//如果所点击的元素包括 => id = showMoreUserInfo
		if (filterDOM('showMoreUserInfo')) {
			//当你点击的仅仅只是头像的时候
			// allHold('showMoreUserInfo.isShow',false)
			showMoreUserInfoFunc({
				isShow: true,
				x: e.nativeEvent.view.innerWidth - e.nativeEvent.x - 220 > 0 ? e.nativeEvent.x : e.nativeEvent.x - 220,
				y: e.nativeEvent.view.innerHeight - e.nativeEvent.y - 373 > 0 ? e.nativeEvent.y : e.nativeEvent.y - 373,
				github:{
					name:'',
					avatar_url:''
				},
				star_count:0
			})
			//还是向后台查询，根据id查询用户详细信息。
			socket({
				url:'user detail',
				user_id: e.nativeEvent.path.filter((index) => {
					e.preventDefault()
					return index.id == 'showMoreUserInfo'
				})[0].getAttribute('data-id'),
			})
		} else if (filterDOM('showMoreUserInfoContainer')) {
			// showEmojiFunc(true)
		} else {
			allHold('showMoreUserInfo.isShow',false)
		}
		//是否显示房间细节
		if (e.nativeEvent.path.filter((index) => {
			return index.className == 'toggleDetail'
		}).length > 0) {
			showRoomDetailFunc(!showRoomDetail)
		} else if (e.nativeEvent.path.filter((e) => e.id == 'bodyContentRoomDetails' || e.id == 'showMoreUserInfoContainer').length > 0) {
			//
		} else {
			showRoomDetailFunc(false)
		}
		//是否显示代码编辑器
		if (e.nativeEvent.path.filter((index) => {
			return index.className == 'codingClick'
		}).length > 0) {
			showCodeEditFunc(!showCodeEdit)
		} else if (
			e.nativeEvent.path.filter((index) => {
				return index.id == 'textArea'
			}).length > 0
		) { } else {
			showCodeEditFunc(false)
		}
		//是否显示Emoji
		if (e.nativeEvent.path.filter((index) => {
			return index.id == 'emojiClick'
		}).length > 0) {
			showEmojiFunc(!showEmoji)
		} else if (
			e.nativeEvent.path.filter((index) => {
				return index.id == 'emojiContainer'
			}).length > 0
		) {
			if (e.nativeEvent.path[0].innerText.length == 2) {
				document.getElementById('bodyContentMessagesInput').value += e.nativeEvent.path[0].innerText
				document.getElementById('bodyContentMessagesInput').focus()
			}
		} else {
			showEmojiFunc(false)
		}
		//是否显示创建群input
		if (e.nativeEvent.path.filter((index) => {
			return index.id == 'addgroup'
		}).length > 0) {
			is_show_create_group_input_func(true)
		} else {
			is_show_create_group_input_func(false)
		}
		//Switch Channel
		if (e.nativeEvent.path.filter((index) => {
			return index.className == 'roomList'
		}).length > 0) {
			this.props.store.socket({
				url: 'get currentRoomInfo',
				name: e.nativeEvent.path.filter((index) => {
					return index.className == 'roomList'
				})[0].id
			})
		}
	}

	render() {
		const { children } = this.props
		return (
			<div
				className={this.props.className}
				{...this.props}
				ref={(ref) => this.container = ref}
				onClick={this.handleAllEventClick}>
				{children}
			</div>
		);
	}
}

export default Trigger;
