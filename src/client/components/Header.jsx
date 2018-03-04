import React, { Component } from 'react';
import { Icon } from 'antd';
import { inject, observer } from 'mobx-react';

@inject('store')
@observer
export default class header extends Component {
  render() {
    const {
      group,
      onlineUsers,
      showRoomDetail,
    } = this.props.store;
    return (
      <div className="header">
        <span className="left" />
        <span className="title">
          {group.group_name == null ? <h1>房间不存在</h1> : (
            group.group_name == '' ? <h1>github chat</h1> : <h1 className="toggleDetail">
              {`${group.group_name}(${group.memberList.filter(e => onlineUsers.indexOf(e.user_id) >= 0).length}/${group.memberList.length})人`}
              {showRoomDetail ? <Icon type="up" /> : <Icon type="down" />}
            </h1>
          )}
        </span>
        <iframe
          frameBorder="0"
          scrolling="0"
          width="91px"
          height="20px"
          src="https://ghbtns.com/github-btn.html?user=pengliheng&repo=chatroom&type=star&count=true"
        >
        </iframe>
      </div>
    );
  }
}
