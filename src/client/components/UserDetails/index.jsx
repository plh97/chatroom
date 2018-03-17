import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

// local
import Avatar from '../Avatar/index.jsx';
import './index.less';

@inject('store')
@observer
export default class UserDetails extends Component {
  render() {
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
              <svg className="icon" role="img" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            💬
          </div>
          <Link className="githubReport" to={`/githubReport/${showMoreUserInfo.github.login}`}>
            看看这货的Github分析报告
          </Link>
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
