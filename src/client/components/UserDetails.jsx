import React, {Component} from 'react'
import {Avatar, Icon} from 'antd'
import {inject, observer} from "mobx-react"
import {colorList} from '../../../config/client.js'
// import '../less/userDetails.less'

@inject("store")
@observer
export default class UserDetails extends Component {
  render() {
    const {match} = this.props
    const {
      myInfo,
      showMoreUserInfo
    } = this.props.store;
    return (
      <div id='showMoreUserInfoContainer' style={{
        left: showMoreUserInfo.x,
        top: showMoreUserInfo.y
      }} className={`showMoreUserInfo ${showMoreUserInfo.isShow
        ? 'show'
        : 'hide'}`}>
        <Avatar
          src={showMoreUserInfo.github.avatar_url}
          className="avatar" shape='square' size="large" style={{
            backgroundColor: colorList[showMoreUserInfo.github.name.charCodeAt() % 8],
            cursor: showMoreUserInfo.github.name == myInfo.github.name
              ? 'pointer'
              : ''
          }}>
          {showMoreUserInfo.github.name.split('')[0]}
        </Avatar>
        <span className="info">
          <span className="nameArea">
            <span className="nameContainer">{showMoreUserInfo.github.name}</span>
            <Icon type="message"/>
          </span>
          <span className="nikeNameArea">
            <span className="nikeNameLabel">备注：</span>
            <span className="nikeName">easy to call!</span>
            <span className="placeLabel">地区：</span>
            <span className="place">中国</span>
          </span>
        </span>
      </div>
    )
  }
};
