// pkg
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

// local
import Loading from './Loading/index.jsx';
import config from '../../../config/project.js';
import SublimeText from './SublimeText.jsx';
import RoomDetails from './RoomDetails.jsx';
import { emoji } from '../../../config/client.js';
import Avatar from './Avatar/index.jsx';


@inject('store')
@observer
export default class content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: '',
      emojiClick: false,
      codingClick: true,
      type: 'text',
      url: 'send message',
    };
  }

  componentDidMount() {
    console.log('componentDidMount');
    const {
      socket, myInfo, allHold, firstIn,
    } = this.props.store;
    const { match } = this.props;
    document.cookie = `redirect_uri=${match.url};Path=/auth`;
    if (!myInfo.github.name) {
      allHold('myInfo.groups', [{
        group_id: '',
        group_name: match.params.group_name,
        avatar_url: 'https://assets.suisuijiang.com/group_avatar_default.jpeg?imageView2/2/w/40/h/40',
      }]);
    }
    allHold('doing', true);
    socket({
      url: 'init group',
      group_name: match.params.group_name,
      firstIn,
    });
    allHold('firstInner', false);
  }

  componentWillReceiveProps(nextProps) {
    const { socket, allHold } = this.props.store;
    allHold('group.messageList', []);
    allHold('doing', true);
    socket({
      url: 'init group',
      group_name: nextProps.match.params.group_name,
    });
  }

  componentDidUpdate() {
    const container = document.querySelector('.contentMessages');
    console.log('componentDidUpdate');
    if (container.children[8]) {
      setTimeout(() => {
        container.children[11].scrollIntoView();
      }, 1);
    }
    window.Prism.highlightAll();
  }

  pasteFile = (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    let i = 0;
    if (clipboardData) {
      const { items } = clipboardData;
      if (!items) {
        return;
      }
      let item = items[0];
      const types = clipboardData.types || [];
      for (i = 0; i < types.length; i++) {
        if (types[i] === 'Files') {
          item = items[i];
          break;
        }
      }
      if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
        const blob = item.getAsFile();
        const form = new FormData();
        form.append('images', blob);
        fetch('/upload', {
          method: 'POST',
          body: form,
        }).then(res => res.json()).then((json) => {
          json.map((image) => {
            this.handleMsgSubmit({
              image,
              type: 'image',
            });
          });
        });
      }
    }
  }
  handleMsgSubmit = (e) => {
    const {
      myInfo,
      group,
      allHold,
    } = this.props.store;
    if (!e.text && !e.code && !e.image) { return; }
    this.props.store.socket({
      url: 'send message',
      group_name: group.group_name,
      group_id: group._id,
      user_id: myInfo.user_id,
      name: myInfo.github.name,
      avatar_url: myInfo.github.avatar_url,
      text: e.text,
      code: e.code,
      image: e.image,
      type: e.type,
    });
    this.textInput.value = '';
    allHold('showCodeEdit', false);
    allHold('showEmoji', false);
  }

  handleImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.click();
    input.addEventListener('change', (e) => {
      const form = new FormData();
      Array.from(e.target.files)
        .filter(file => file.type && file.type.split('/')[0] === 'image')
        .forEach((file) => {
          form.append('images', file, file.name);
        });
      fetch('/upload', {
        method: 'POST',
        body: form,
      }).then(res => res.json()).then((rep) => {
        rep.forEach((image) => {
          this.handleMsgSubmit({
            image,
            type: 'image',
          });
        });
      });
      input.remove();
    }, false);
  }

  scrollToBottom = (data) => {
    console.log('scrollTobottom');
    this.messagesEnd.scrollIntoView(data);
  }

  timesCalc = (() => {
    let PRIVATE = 0;
    return {
      inc: () => {
        PRIVATE += 1;
        return PRIVATE;
      },
    };
  })();

  render() {
    const { match } = this.props;
    const {
      initMyInfo, scrollToBottom, group, allHold, doing, myInfo, showEmoji, pageIndex,
    } = this.props.store;
    // if (scrollToBottom) {
    //   this.scrollToBottom({
    //     behavior: 'auto',
    //   });
    //   allHold('scrollToBottom', false);
    // }
    if (initMyInfo) {
      document.addEventListener('paste', this.pasteFile);
      allHold('initMyInfo', false);
    }
    return (
      <div
        refs="content"
        style={{ overflow: 'initial' }}
        className="content"
        key={match.params.group_name}
      >
        <RoomDetails />
        <div className="contentMessages" refs="contentMessages">
          <Loading className="contentMessagesWait" />
          {group && group.messageList.slice(group.messageList.length - (pageIndex * 10)).map((post, i) => (
            <div className={`contentMessagesList ${post.user_name === myInfo.github.name ? 'me' : 'other'}`} key={i}>
              <Avatar
                data-id={post.user_id}
                src={post.avatar_url}
                id="showMoreUserInfo"
                className="avatar"
                shape="square"
                size="middle"
              />
              <div className="containerContent">
                <p className="messageTittle">
                  <span className="nameContainer">
                    {post.user_name}
                  </span>
                  <span className="timeContainer">
                    {(new Date(post.create_time)).toLocaleString() === 'Invalid Date' ? post.create_time : (new Date(post.create_time)).toLocaleString()}
                  </span>
                </p>
                {post.text &&
                  <p className={`messageContainer ${post.type}`}>
                    {post.text}
                  </p>}
                {post.image ?
                  <img
                    // onLoad={this.scrollToBottom.bind(this, 'auto')}
                    className={`messageContainer ${post.type}`}
                    style={{
                      width: post.image.width,
                      height: post.image.height,
                    }}
                    src={post.image.url}
                    alt={`${post.image.width, post.image.height}头.像`}
                  /> : ''}
                {post.code ?
                  <pre
                    style={{ overflow: 'auto' }}
                    className={`${post.type} messageContainer`}
                  >
                    <code className="language-jsx">
                      {post.code}
                    </code>
                  </pre> : ''}
              </div>
            </div>
          ))}
          <div id="bottomInToView"
            style={{ float: 'left', clear: 'both' }}
            ref={(el) => { this.messagesEnd = el; }}
          />
        </div>
        {myInfo.github.name &&
          <div className="contentFeature">
            <span className="emojiClick" id="emojiClick" aria-label="emojiclick" role="img">🙂</span>
            <div id="emojiContainer" className={showEmoji ? 'emojiContainer display' : 'emojiContainer none'}>
              {emoji.split(' ').map((index, i) => (
                <span key={i} className="emoji">{index}</span>
              ))}
            </div>
            <span className="picture" id="picture" onClick={this.handleImage} aria-label="picture" role="img">📁</span>
            <span className="codingClick" role="img📋">{'</>'}</span>
            <SublimeText handleMsgSubmit={this.handleMsgSubmit} />
          </div>}
        {myInfo.github.name &&
          <form
            className="contentMessagesInputArea"
            onSubmit={(e) => {
            e.preventDefault();
            this.handleMsgSubmit({
              type: 'text',
              text: this.textInput.value,
            });
          }}
          >
            <input
              ref={(c) => { this.textInput = c; }}
              className="contentMessagesInput"
              id="contentMessagesInput"
              placeholder="chat content"
            />
          </form>
        }
        {!myInfo.github.name &&
          <div className="contentFeature">
            <h2>
              请登录
              <a href={`https://github.com/login/oauth/authorize?client_id=${config.githubClientID}`}>github</a>
            </h2>
          </div>}
      </div>
    );
  }
}
