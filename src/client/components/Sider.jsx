import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

// local
import Avatar from './Avatar/index';

@inject('store')
@observer
export default class sider extends Component {
  addGroup = (e) => {
    const {
      myInfo,
      allHold,
    } = this.props.store;
    e.preventDefault();
    allHold('is_show_create_group_input', false);
    this.props.store.socket({
      url: 'create group',
      user_id: myInfo.user_id,
      group_name: this.creat_group_input.value,
    });
  }
  render() {
    const { match } = this.props;
    const {
      onlineUsers,
      myInfo,
      is_show_create_group_input,
    } = this.props.store;
    return (
      <div className="sider">
        <div className="myInfo">
          <Avatar
            src={myInfo.github.avatar_url}
            id="showMoreUserInfo"
            data-id={myInfo.user_id}
            className="avatar"
            badge={myInfo.status}
            shape="square"
            size="large"
          />
          <span className="name">{myInfo.github.name}</span>
        </div>
        {myInfo.groups.map((group, i) => (
          <Link
            key={i}
            id={group.group_name}
            // 如果你点击的是一样的url，那么禁止跳转
            className={`groupList ${`${match.url}/${group.group_name}` === decodeURIComponent(location.pathname) ? 'active' : ''}`}
            onClick={(e) => {
              `${match.url}/${group.group_name}` === decodeURIComponent(location.pathname) ? e.preventDefault() : '';
            }}
            to={`${match.url}/${group.group_name}`}
          >
            <Avatar
              src={group.avatar_url}
              className="slideAvatar"
              size="middle"
              shape="square"
            />
            <span className="groupName">{group.group_name}</span>
          </Link>
        ))}
        {myInfo.user_id &&
          <span onClick={this.toggle} className="addgroup" id="addgroup">
            👪
            {is_show_create_group_input ?
              <form className="form" onSubmit={this.addGroup}>
                <input
                  ref={(c) => { this.creat_group_input = c; }}
                  placeholder="enter"
                  className="input"
                  id="input"
                  type="text"
                />
              </form> : 'create group'}
          </span>
        }
      </div>
    );
  }
}
