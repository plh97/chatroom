import React from 'react'
import {Avatar} from 'antd';
import {inject, observer} from "mobx-react"
import { colorList } from '../../../config/client.js'
// import '../less/roomDetails.less'


@inject("store")
@observer
export default class RoomDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: ''
    }
  }

  handleAvatorChange = (e) => {
    let data = new FormData()
    const {doing, userId} = this.props.store;
    this.setState({files: e.target.files[0]})
    data.append("smfile", this.state.files)
    fetch('https://sm.ms/api/upload', {
      method: 'POST',
      body: data
    }).then(response => response.json()).then(success => {
      // this.props.store.socket.emit('change avator',
      // 	{
      // 		avatorUrl : success.data.url,
      // 		userId : userId
      // 	}
      // );
      // document.cookie = 'avatorUrl=' + success.data.url
      // this.state.socket.emit('get list')
    })
  }

  render() {
    const {currentRoomInfo, myInfo, showRoomDetail, onlineUsers} = this.props.store;
    const showRoomDetailListText = [
      {
        title: '群头像',
        onlineUsers: [
          {
            userName: currentRoomInfo.name
          }
        ],
        offlineUsers: []
      }, {
        title: '管理员',
        onlineUsers: [...currentRoomInfo.administratorList.filter(e => onlineUsers.indexOf(e.userName) >= 0)],
        offlineUsers: [...currentRoomInfo.administratorList.filter(e => onlineUsers.indexOf(e.userName) == -1)]
      }, {
        title: '成员',
        onlineUsers: [...currentRoomInfo.memberList.filter(e => onlineUsers.indexOf(e.userName) >= 0)],
        offlineUsers: [...currentRoomInfo.memberList.filter(e => onlineUsers.indexOf(e.userName) == -1)]
      }
    ]
    return (
      <div id='bodyContentRoomDetails' className={`bodyContentRoomDetails ${showRoomDetail
        ? 'show'
        : 'hide'}`}>
        {showRoomDetailListText.map((avators, i) => (
          <div className="showRoomDetailList" key={i}>
            <span className="title">{avators.title}:</span>
            <span className="avatorContainer">
              {[
                ...avators.onlineUsers,
                ...avators.offlineUsers
              ].map((avator, j) => (
                <span className="avator" key={j}>
                  <Avatar src={avator.avatorUrl} className="slideAvator" id="showMoreUserInfo" size="large" style={{
                    backgroundColor: j >= avators.onlineUsers.length
                      ? '#aaa'
                      : colorList[avator.userName.charCodeAt() % 8]
                  }}>
                    {avator.userName.split('')[0]}
                  </Avatar>
                  {avator.userName == myInfo.name
                    ? <input style={{
                        display: 'none'
                      }} onChange={this.handleAvatorChange} value={this.state.file} id='avatorInputFile' className='avatorInputFile' type="file"/>
                    : ""}
                  <span className="name">{avator.userName}</span>
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    );
  }
}
