// pkg
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import io from 'socket.io-client';
import Prism from 'prismjs';
import debounce from 'lodash.debounce';
// import axios from 'axios';

// local
import Loading from './Loading/index';
import config from '../../../config/project';
import SublimeText from './SublimeText';
import RoomDetails from './RoomDetails';
import { emoji } from '../../../config/client';
import Avatar from './Avatar/index';

const socket = io.connect({ secure: true });

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
    socket.on('send message', (json) => {
      // this.scrollToBottom = true;
      const lastdom = document.querySelector('.contentMessages').lastChild;
      const wrapper = document.createElement('div');
      const html = `
        <div class="contentMessagesList me">
          <div class="self-avatar avatar middle" data-id="${json.user_id}" id="showMoreUserInfo">
            <img class="middle square" src="${json.avatar_url}" alt="头像">
          </div>
          <div class="containerContent">
            <p class="messageTittle">
              <span class="nameContainer">${json.user_name}</span>
              <span class="timeContainer">${(new Date()).toLocaleString()}</span>
            </p>
            ${json.type === 'text' ? `<p class="messageContainer text">${json.text}</p>` : ''}
            ${json.type === 'code' ? `
              <pre style="overflow: auto" class="code messageContainer language-jsx">
                <code class="language-jsx">
                  ${json.code}
                </code>
              </pre>
            ` : ''}
            ${json.type === 'image' ? `<img class="messageContainer image" alt="聊天室图片" src="${json.image.url}">` : ''}
            ${json.type === 'vedio' ? `
              <iframe
                title="youtube vedio"
                src="${json.vedio.url}"
                frameBorder="0"
                allowFullScreen
                class="messageContainer vedio"
              />
            ` : ''}
          </div>
        </div>
      `;
      wrapper.innerHTML = html;
      const newDom = wrapper.querySelector('.contentMessagesList');
      document.querySelector('.contentMessages').insertBefore(newDom, lastdom);
      setTimeout(() => {
        document.querySelector('#bottomInToView').scrollIntoView();
        Prism.highlightAll();
      }, 0);
    });
  }

  componentDidMount() {
    const {
      socket, myInfo, allHold, firstIn,
    } = this.props.store;
    const { match } = this.props;
    document.cookie = `redirect_uri=${match.url};Path=/auth`;
    if (!myInfo.github.name) {
      allHold('myInfo.groups', [{
        group_id: '',
        group_name: match.params.group_name,
        avatar_url: config.groupDefaultAvator,
      }]);
    }
    socket({
      url: 'init group',
      group_name: match.params.group_name,
      firstIn,
    });
    allHold('firstInner', false);
    document.querySelector('.contentMessages').addEventListener('scroll', debounce(this.handleScroll, 50));
  }

  componentWillReceiveProps(nextProps) {
    const { socket, allHold } = this.props.store;
    allHold('group.messageList', []);
    socket({
      url: 'init group',
      group_name: nextProps.match.params.group_name,
    });
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
    const container = document.querySelector('.contentMessages');
    if (container.children[8]) {
      setTimeout(() => {
        container.children[11].scrollIntoView();
      }, 1);
    }
    window.Prism.highlightAll();
  }
  // 处理监听事件
  handleScroll = (e) => {
    // 到顶，并且有足够数据来加载
    const { allHold, pageIndex, group } = this.props.store;
    if (e.target.scrollTop < 80 && this.props.store.group.messageList.length > 10) {
      const len = group.messageList.length;
      const c = document.createDocumentFragment();
      group.messageList.slice(len - ((pageIndex + 1) * 10), len - (pageIndex * 10))
        .forEach((json) => {
          // this.scrollToBottom = true;
          const wrapper = document.createElement('div');
          const html = `
            <div class="contentMessagesList me">
              <div class="self-avatar avatar middle" data-id="${json.user_id}" id="showMoreUserInfo">
                <img class="middle square" src="${json.avatar_url}" alt="头像">
              </div>
              <div class="containerContent">
                <p class="messageTittle">
                  <span class="nameContainer">${json.user_name}</span>
                  <span class="timeContainer">${(new Date()).toLocaleString()}</span>
                </p>
                ${json.type === 'text' ? `<p class="messageContainer text">${json.text}</p>` : ''}
                ${json.type === 'code' ? `
                  <pre style="overflow: auto" class="code messageContainer language-jsx">
                    <code class="language-jsx">
                      ${json.code}
                    </code>
                  </pre>
                ` : ''}
                ${json.type === 'image' ? `<img class="messageContainer image" alt="聊天室图片" src="${json.image.url}">` : ''}
                ${json.type === 'vedio' ? `
                  <iframe
                    title="youtube vedio"
                    src="${json.vedio.url}"
                    frameBorder="0"
                    allowFullScreen
                    class="messageContainer vedio"
                  />
                ` : ''}
              </div>
            </div>
          `;
          wrapper.innerHTML = html;
          c.appendChild(wrapper.querySelector('.contentMessagesList'));
        });
      // 当前页数+1
      const lastdom = document.querySelector('.contentMessages .loading').nextElementSibling;
      document.querySelector('.contentMessages').insertBefore(c, lastdom);
      allHold('pageIndex', pageIndex + 1);
    }
  }
  // 监听剪切板函数
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
      for (i = 0; i < types.length; i += 1) {
        if (types[i] === 'Files') {
          item = items[i];
          break;
        }
      }
      if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
        const blob = item.getAsFile();
        const form = new FormData();
        form.append('file', blob);
        fetch('https://api.pipk.top/upload', {
          method: 'POST',
          body: form,
        })
          .then(res => res.json())
          .then((json) => {
            json.forEach((img) => {
              this.handleMsgSubmit({
                image: {
                  name: img.name,
                  url: img.url,
                },
                type: 'image',
              });
            });
          });
      }
    }
  }
  // 真正发消息函数，运用socket技术
  handleMsgSubmit = (e) => {
    const {
      myInfo,
      group,
      allHold,
    } = this.props.store;
    if (!e.text && !e.code && !e.image && !e.vedio) { return; }
    this.props.store.socket({
      url: 'send message',
      group_name: group.group_name,
      group_id: group._id,
      user_id: myInfo.user_id,
      name: myInfo.github.name,
      avatar_url: myInfo.github.avatar_url,
      text: e.text,
      code: e.code,
      vedio: e.vedio,
      image: e.image,
      type: e.type,
    });
    this.textInput.value = '';
    allHold('showCodeEdit', false);
    allHold('showEmoji', false);
  }
  // 上传图片函数
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
          form.append('file', file, file.name);
        });
      fetch('https://api.pipk.top/upload', {
        method: 'POST',
        body: form,
      }).then(res => res.json())
        .then((rep) => {
          rep.forEach((image) => {
            this.handleMsgSubmit({
              image: {
                url: image.url,
                name: image.name,
              },
              type: 'image',
            });
          });
        });
      input.remove();
    }, false);
  }
  // 上传youtube视频函数
  handleVedio = () => {
    const url = prompt('视频格式：https://www.youtube.com/embed/xreEKuBBJFE');
    if (url) {
      // 确认
      let youtubeId = url.split('/');
      youtubeId = youtubeId[youtubeId.length - 1];
      if (youtubeId.length === 11) {
        // 这个是视频格式
        this.handleMsgSubmit({
          vedio: {
            url: `https://www.youtube.com/embed/${youtubeId}`,
          },
          type: 'vedio',
        });
      } else {
        // 无法识别
        console.log('这个不是YouTube地址');
      }
    }
  }

  scrollToBottom = (data) => {
    this.messagesEnd.scrollIntoView(data);
  }

  render() {
    const { match } = this.props;
    const {
      initMyInfo, scrollToBottom, group, allHold, myInfo, showEmoji, pageIndex,
    } = this.props.store;
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
        <div className="contentMessages" refs="contentMessages" ref={(e) => { this.container = e; }}>
          <Loading className="contentMessagesWait" />
          {group && group.messageList.slice(group.messageList.length - 10).map((post, i) => (
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
                    className={`messageContainer ${post.type}`}
                    style={{
                      width: post.image.width,
                      height: post.image.height,
                    }}
                    alt="聊天室图片"
                    src={post.image.url}
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
                {post.vedio ?
                  <iframe
                    ref={(c) => { this.vedio = c; }}
                    title="youtube vedio"
                    src={`${post.vedio.url}`}
                    frameBorder="0"
                    allowFullScreen
                    className={`messageContainer ${post.type}`}
                  />
                  : ''}
              </div>
            </div>
          ))}
          <div
            id="bottomInToView"
            style={{ float: 'left', clear: 'both' }}
            ref={(el) => { this.messagesEnd = el; }}
          />
        </div>
        {myInfo.github.id &&
          <div className="contentFeature">
            <span className="emojiClick" id="emojiClick" aria-label="emojiclick" role="img">🙂</span>
            <div id="emojiContainer" className={showEmoji ? 'emojiContainer display' : 'emojiContainer none'}>
              {emoji.split(' ').map((index, i) => (
                <span key={i} className="emoji">{index}</span>
              ))}
            </div>
            <span className="picture" id="picture" onClick={this.handleImage} aria-label="picture" role="img">📁</span>
            <span className="codingClick" role="img📋">{'</>'}</span>
            <span className="picture" id="vedio" onClick={this.handleVedio} aria-label="vedio" role="img">🎥</span>
            <SublimeText handleMsgSubmit={this.handleMsgSubmit} />
          </div>}
        {myInfo.github.id &&
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
        {!myInfo.github.id &&
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
