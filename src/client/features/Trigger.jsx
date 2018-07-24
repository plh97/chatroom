import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

// local
import { composedPath } from './dom';

@inject('store')
@observer
class Trigger extends Component {
  // 事件总代理模型
  // all event only Perform their own duties
  componentDidMount() {
    if (this.container.querySelector('.contentMessages')) {
      this.container.addEventListener('click', this.handleClick);
    }
  }
  handleClick = (e) => {
    const {
      allHold, socket, showRoomDetail, showCodeEdit, showEmoji, showMoreUserInfo,
    } = this.props.store;
    // avator click
    // whether show avator details
    const path = e.path || (e.composedPath && e.composedPath()) || composedPath(e.target);
    const filterDOM = dom => path.filter(index => index.id === dom).length > 0;
    if (filterDOM('showMoreUserInfo')) {
      allHold('showMoreUserInfo', {
        isShow: true,
        x: e.view.innerWidth - e.x - 220 > 0 ? e.x : e.x - 220,
        y: e.view.innerHeight - e.y - 373 > 0 ? e.y : e.y - 373,
        github: {
          name: '',
          avatar_url: '',
        },
        star_count: 0,
      });
      // 还是向后台查询，根据id查询用户详细信息。
      socket({
        url: 'user detail',
        user_id: path.filter((index) => {
          e.preventDefault();
          return index.id === 'showMoreUserInfo';
        })[0].getAttribute('data-id'),
      });
    } else if (filterDOM('showMoreUserInfoContainer')) {
      // showEmojiFunc(true)
    } else {
      allHold('showMoreUserInfo.isShow', false);
    }
    // 是否显示房间细节
    if (path.filter(index => index.className === 'toggleDetail').length > 0) {
      allHold('showRoomDetail', !showRoomDetail);
    } else if (path.filter(ev => ev.id === 'contentRoomDetails' || ev.id === 'showMoreUserInfoContainer').length > 0) {
      //
    } else {
      allHold('showRoomDetail', false);
    }
    // 是否显示代码编辑器
    if (path.filter(index => index.className === 'codingClick').length > 0) {
      allHold('showCodeEdit', !showCodeEdit);
    } else if (
      path.filter(index => index.id === 'textArea').length > 0
    ) {
      return;
    } else {
      allHold('showCodeEdit', false);
    }
    // 是否显示Emoji
    if (path.filter(index => index.id === 'emojiClick').length > 0) {
      allHold('showEmoji', !showEmoji);
    } else if (
      path.filter(index => index.id === 'emojiContainer').length > 0
    ) {
      if (path[0].innerText.length === 2) {
        document.getElementById('contentMessagesInput').value += path[0].innerText;
        document.getElementById('contentMessagesInput').focus();
      }
    } else {
      allHold('showEmoji', false);
    }
    // 是否显示创建群input
    if (path.filter(index => index.id === 'addgroup').length > 0) {
      allHold('is_show_create_group_input', true);
    } else {
      allHold('is_show_create_group_input', false);
    }
    // Switch Channel
    if (path.filter(index => index.className === 'roomList').length > 0) {
      this.props.store.socket({
        url: 'get currentRoomInfo',
        name: path.filter(index => index.className === 'roomList')[0].id,
      });
    }
  }

  render() {
    return (
      <div className={this.props.className} ref={(e) => { this.container = e; }}>
        { this.props.children }
      </div>
    );
  }
}

export default Trigger;
