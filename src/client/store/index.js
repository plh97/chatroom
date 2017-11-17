import { action, useStrict, computed, observable } from "mobx";
import io from 'socket.io-client';
import config from '../../../config/project.js'

const socket = io.connect({ secure: true });
// const socket = io();

class List {
  @observable message
  @observable time
  @observable userName
  @observable avatar_url
  constructor(e) {
    this.message = e.message
    this.time = e.time
    this.userName = e.userName
    this.avatar_url = e.avatar_url
  }
}
class User {
  @observable userName
  @observable avatar_url
  constructor(e) {
    this.userName = e.userName
    this.avatar_url = e.avatar_url
  }
}
// useStrict(true)
class TodoStore {
  //我的用户信息
  @observable myInfo = {
    name: '',
    id: '',
    avatar_url: ''
  }
  //当前房间信息
  @observable currentRoomInfo = {
    id: '',
    name: '',
    avatar_url: '',
    creator: '',
    //管理员信息
    administratorList: [],
    //成员信息
    memberList: [],
    messageList: []
  }
  //是否显示用户详细信息
  @observable showRoomDetail = false
  //是否显示表情容器
  @observable showEmoji = false
  //是否显示代码编辑器
  @observable showCodeEdit = false
  //是否显示用户信息详情
  @observable showMoreUserInfo = {
    isShow: false,
    x: 0,
    y: 0,
    name: '',
    avatar_url: ''
  }
  @observable code = ''
  @observable messageType = 'text'
  @observable roomList = [{
    name: 'Moonlight',
    avatar_url: ''
  }]
  //当前在线用户
  @observable onlineUsers = []
  @observable doing = false
  //登陆/注册用户返回信息提示
  @observable tip = '请登录'
  //登陆/注册用户返回总体json
  @observable callBack = {}
  //用户详情信息
  @observable callBack = {}
  //封装好的socket.emit
  @action socket = (state) => {
    socket.emit(state.url, state)
  }
  @action tipFunc = (state) => {
    this.tip = state
  }
  @action currentRoomInfoFunc = (state) => {
    this.currentRoomInfo.roomName = state
  }
  @action showRoomDetailFunc = (state) => {
    this.showRoomDetail = state
  }
  @action showCodeEditFunc = (state) => {
    this.showCodeEdit = state
  }
  @action showEmojiFunc = (state) => {
    this.showEmoji = state
  }
  @action showMoreUserInfoFunc = (state) => {
    this.showMoreUserInfo = state
  }
  @action allHold = (left, right) => {
    if (left.split('.').length == 1) {
      this[left] = right
    } else if (left.split('.').length == 2) {
      this[
        left.split('.')[0]
      ][
        left.split('.')[1]
      ] = right
    } else if (left.split('.').length == 3) {
      this[left.split('.')[0]][
        left.split('.')[1]
      ][
        left.split('.')[2]
      ] = right
    }
  }
  constructor() {
    socket.on('get myInfo', json => {
      this.myInfo = {
        id: json.github.id,
        name: json.github.name,
        avatar_url: json.github.avatar_url
      }
      this.roomList = json.groups
    })
    socket.on('get users', json => {
      this.onlineUsers = json
    })
    socket.on('init room', json => {
      this.currentRoomInfo.messageList = json.messageList
      this.currentRoomInfo.memberList = json.memberList
      this.currentRoomInfo.name = json.name
      this.currentRoomInfo.avatar_url = json.avatar_url
      this.currentRoomInfo.administratorList = json.administratorList
    })

    socket.on('send message', json => {
      this.currentRoomInfo.messageList.push(json)
    })

    socket.on('add room', json => {
      if (json.code == 0) {
        console.log(json.message)
      } else {
        this.roomList.push(json)
      }
    })

    socket.on('user detail', json => {
      console.log(json);
      this.showMoreUserInfo.name = json.github.name
      this.showMoreUserInfo.avatar_url = json.github.avatar_url
    })
  }
}
window.store = new TodoStore
var store = window.store
export default store
