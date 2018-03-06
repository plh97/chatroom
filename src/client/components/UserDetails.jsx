import React, { Component } from 'react';
import { Icon } from 'antd';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

// local
import Avatar from './Avatar/index.jsx';

@inject('store')
@observer
export default class UserDetails extends Component {
  mouseEnter = () => {
    this.githubReport.scrollIntoView({
      behavior: 'smooth',
    });
  }
  mouseLeave = () => {
    this.followers.scrollIntoView({
      behavior: 'smooth',
    });
  }
  render() {
    const { match } = this.props;
    const {
      myInfo,
      showMoreUserInfo,
    } = this.props.store;
    return (
      <div
        id="showMoreUserInfoContainer"
        style={{
          left: showMoreUserInfo.x,
          top: showMoreUserInfo.y,
        }}
        className={`showMoreUserInfo ${showMoreUserInfo.isShow ? 'show' : 'hide'}`}
      >
        <Avatar
          src={showMoreUserInfo.github.avatar_url}
          className="avatar"
          shape="square"
          size="large"
        />
        <div className="info">
          <div className="nameArea">
            <span className="nameContainer">{showMoreUserInfo.github.name}</span>
            <a className="github-icon" target="_blank" href={showMoreUserInfo.github.html_url}>
              <Icon type="github" />
            </a>
            💬
          </div>
          <div
            onMouseLeave={this.mouseLeave}
            onMouseEnter={this.mouseEnter}
            className="followRepot"
          >
            <span
              ref={(el) => { this.followers = el; }}
              className="followers"
            >
              <span className="count">
                {showMoreUserInfo.github.followers}
              </span>
              followers
            </span>
            <span className="repos">
              <span className="count">
                {showMoreUserInfo.github.public_repos}
              </span>
              repots
            </span>
            <span className="following">
              <span className="count">
                {showMoreUserInfo.star_count}
              </span>
              stars
            </span>
            <span
              ref={(el) => { this.githubReport = el; }}
              className="githubReport"
            >
              <Link to="/githubReport">
                看看这货的Github分析报告
              </Link>
            </span>
          </div>
          {showMoreUserInfo.github.bio && showMoreUserInfo.github.bio.length &&
          <div className="infoList">
            <span className="label" role="img" aria-label="bio">🙆</span>
            <span className="content">{showMoreUserInfo.github.bio}</span>
          </div>}
          {showMoreUserInfo.github.location && showMoreUserInfo.github.location.length &&
          <div className="infoList">
            <span className="label" role="img" aria-label="location">📌</span>
            <span className="content">{showMoreUserInfo.github.location}</span>
          </div>}
          {showMoreUserInfo.github.email && showMoreUserInfo.github.email.length &&
          <div className="infoList">
            <span className="label" role="img" aria-label="email">📧</span>
            <a className="content" href={`mailto:${showMoreUserInfo.github.email}`}>{showMoreUserInfo.github.email}</a>
          </div>}
          {showMoreUserInfo.github.blog && showMoreUserInfo.github.blog.length &&
          <div className="infoList">
            <span className="label" role="img" aria-label="link">🔗</span>
            <a className="content" target="_blank" href={showMoreUserInfo.github.blog}>{showMoreUserInfo.github.blog}</a>
          </div>}
        </div>
      </div>
    );
  }
}
