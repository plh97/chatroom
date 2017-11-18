import React, {Component} from 'react'
import {Avatar, Icon} from 'antd'
import {inject, observer} from "mobx-react"
import {colorList} from '../../../config/client.js'

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
        <div className="info">
          <div className="nameArea">
            <span className="message" className="nameContainer">{showMoreUserInfo.github.name}</span>
            <a className="github" target="_blank" href={showMoreUserInfo.github.html_url}>
              <Icon type="github"/>
            </a>
            <Icon type="message"/>
          </div>
          <div className="followRepot">
            <span className="followers">
              {showMoreUserInfo.github.followers} followers
            </span>
            <span className="repos">
              {showMoreUserInfo.github.public_repos}&nbsp;repots
            </span>
            <span className="following">
              {showMoreUserInfo.github.following} following
            </span>
          </div>
          {showMoreUserInfo.github.bio && showMoreUserInfo.github.bio.length && <div className="infoList">
            <span className="label">🙆</span>
            <span className="content">{showMoreUserInfo.github.bio}</span>
          </div>}
          {showMoreUserInfo.github.location && showMoreUserInfo.github.location.length && <div className="infoList">
            <span className="label">📌</span>
            <span className="content">{showMoreUserInfo.github.location}</span>
          </div>}
          {showMoreUserInfo.github.email && showMoreUserInfo.github.email.length && <div className="infoList">
            <span className="label">📧</span>
            <a className="content" href={`mailto:${showMoreUserInfo.github.email}`}>{showMoreUserInfo.github.email}</a>
          </div>}
          {showMoreUserInfo.github.blog && showMoreUserInfo.github.blog.length && <div className="infoList">
            <span className="label">🔗</span>
            <a className="content" target="_blank" href={showMoreUserInfo.github.blog}>{showMoreUserInfo.github.blog}</a>
          </div>}
        </div>
      </div>
    )
  }
};


