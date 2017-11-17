import React from 'react'
import { Avatar } from 'antd';
import { inject, observer } from "mobx-react"
import { colorList } from '../../../config/client.js'

@inject("store")
@observer
export default class RoomDetails extends React.Component {
  render() {
    const { currentRoomInfo, myInfo, showRoomDetail, onlineUsers } = this.props.store;
    const showRoomDetailListText = [
      {
        title: '群头像',
        onlineUsers: [{ name: currentRoomInfo.name }],
        offlineUsers: []
      }, {
        title: '管理员',
        onlineUsers: [...currentRoomInfo.administratorList.filter(e => onlineUsers.indexOf(e.name) >= 0)],
        offlineUsers: [...currentRoomInfo.administratorList.filter(e => onlineUsers.indexOf(e.name) == -1)]
      }, {
        title: '成员',
        onlineUsers: [...currentRoomInfo.memberList.filter(e => onlineUsers.indexOf(e.name) >= 0)],
        offlineUsers: [...currentRoomInfo.memberList.filter(e => onlineUsers.indexOf(e.name) == -1)]
      }
    ]
    return (
      <div id='bodyContentRoomDetails' className={`bodyContentRoomDetails ${showRoomDetail
        ? 'show'
        : 'hide'}`}>
        {showRoomDetailListText.map((avatars, i) => (
          <div className="showRoomDetailList" key={i}>
            <span className="title">{avatars.title}:</span>
            <span className="avatarContainer">
              {[
                ...avatars.onlineUsers,
                ...avatars.offlineUsers
              ].map((avatar, j) => (
                <span
                  className="avatar" 
                  key={j}>
                  <Avatar
                    id="showMoreUserInfo"
                    data-id={avatar._id}
                    className="slideAvatar"
                    size="large"
                    src={avatar.avatar_url}
                    style={{ backgroundColor: colorList[avatar.name.charCodeAt() % 8] }}>
                    {avatar.name.split('')[0]}
                  </Avatar>
                  <span className="name">{avatar.name}</span>
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    )
  }
}
