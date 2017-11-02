import React, {Component} from 'react'
import {Avatar, Icon} from 'antd'
import {inject, observer} from "mobx-react"
import {colorList} from '../../../config/client.js'
// import '../less/userDetails.less'

@inject("store")
@observer
export default class AsyncApp extends Component {
  render() {
    const {match} = this.props
    const {
      //登陆用户的个人信息
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
        // src={showMoreUserInfo.avatorUrl}
        className="avator" shape='square' size="large" style={{
          backgroundColor: colorList[showMoreUserInfo.name.charCodeAt() % 8],
          cursor: showMoreUserInfo.name == myInfo.name
            ? 'pointer'
            : ''
        }}>
          {showMoreUserInfo.name.split('')[0]}
        </Avatar>
        <span className="info">
          <span className="nameArea">
            <span className="nameContainer">{showMoreUserInfo.name}</span>
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
