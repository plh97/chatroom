import React from 'react'
import { Avatar } from 'antd';
import { inject, observer } from "mobx-react"
import { colorList } from '../../../config/client.js'

@inject("store")
@observer
export default class RoomDetails extends React.Component {
  render() {
    const { group, showRoomDetail, onlineUsers } = this.props.store;
    const showRoomDetailListText = [
      {
        title: '群头像',
        onlineUsers: [{ name: group.name }],
        offlineUsers: []
      }, {
        title: '管理员',
        onlineUsers: [...group.administratorList.filter(e => onlineUsers.indexOf(e.name) >= 0)],
        offlineUsers: [...group.administratorList.filter(e => onlineUsers.indexOf(e.name) == -1)]
      }, {
        title: '成员',
        onlineUsers: [...group.memberList.filter(e => onlineUsers.indexOf(e.name) >= 0)],
        offlineUsers: [...group.memberList.filter(e => onlineUsers.indexOf(e.name) == -1)]
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
