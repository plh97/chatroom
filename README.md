# Chatroom

[![Build Status](https://travis-ci.org/pengliheng/chatroom.svg?branch=develop)](https://travis-ci.org/pengliheng/chatroom)
[![codeCov](https://codecov.io/gh/pengliheng/chatroom/branch/develop/graph/badge.svg)](https://codecov.io/gh/pengliheng/chatroom)

## Run command

```bash
docker-compose up --build
```

## Api Code

```bash
code: 0 // success
code: 1 // fail
```

## TODO

- [x] 修改个人信息
- [x] 添加 index.scoped.scss 局部样式
- [x] 发送图片
- [x] 向上加载更多消息
- [ ] 房间
- [ ] 表情包
- [ ] websocket
- [ ] add css scoped [https://github.com/gaoxiaoliangz/react-scoped-css]
- [ ] 语音发送
- [ ] 视频通讯
- [ ] 第三方登录

## 功能说明

1. 登录/注册
2. 搜索框, 出现如下 4 个区域内容, 如果能搜出东西, 才会出现该区域.
   1. 用户的检索, 采用完全匹配
   2. 房间内有该人的房间
   3. 房间名字的检索
   4. 聊天内容的检索.
3. 添加好友, 同意或者拒绝, 后端API应该防止重复添加好友. 前端应该在搜索人的时候, 将已经是好友的, 点击直接进入聊天框. 还不是好友的
4. 添加聊天 2 人对话, 三人以上群聊, 都属于聊天框, 只能拉朋友进入聊天群.
