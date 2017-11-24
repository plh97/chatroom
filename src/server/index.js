//package
const http = require('http');
const path = require('path');
const IO = require('socket.io');
const mongoose = require('mongoose');

//local
const app = require('./app');
const User = require('./models/User.model');
const Token = require('./models/Token.model');
const Group = require('./models/Group.model');
const config = require('../../config/server');
const allRouter = require('./routes/index.js');

//utils
const { getCookie, getUrl } = require('./utils/get')

//app
const port = process.env.PORT || config.port;
const server = http.createServer(app.callback())
const io = new IO(server);


mongoose.Promise = global.Promise;
mongoose.connect(config.proDatabase, { useMongoClient: true })
	.then(() => {
		io.on('connection', async (socket) => {
			console.log('connection');
			let access_token = getCookie(socket).access_token
			if (access_token) {
				var myInfo = await Token.verify({ access_token: access_token })
				if (myInfo) {
					socket.emit('get myInfo', myInfo)
				}
			}
			//检测用户当前url
			//根据urlpathname，将相关group信息发给用户，不用等到用户再传要求groupinfo的信号了
			let urlArray = getUrl(socket).pathname.split('/')
			if (urlArray[1] == 'group' && urlArray[2]) {
				let group_name = urlArray[2]
				//先将之前左右的room全部退出，然后加入当前房间
				for (let prop in socket.rooms) {
					socket.leave(socket.rooms[prop])
				}
				let groupInfo = await Group.findOnePretty({ group_name: group_name })
				socket.join(groupInfo._id.toString())
				socket.emit('init group', groupInfo)
			}

			socket.on('send message', async (json) => {
				console.log('send message', json);
				let message = await Group.sendMsg(json)
				let user = await User.findOne({ user_id: json.user_id })
				message = Object.assign({}, message, {
					user_name: user.github.name,
					avatar_url: user.github.avatar_url,
					update_time: message.update_time,
					create_time: message.create_time,
				})
				io.to(json.group_id).emit('send message', message)
			})

			socket.on('user detail', async (json) => {
				console.log('user detail', json);
				let user = await User.findOne({ user_id: json.user_id })
				socket.emit('user detail', user)
			})

			socket.on('create group', async (json) => {
				console.log('create group', json);
				let group = await Group.create({
					group_name: json.group_name,
					administratorList: [json.user_id],
					memberList: [json.user_id],
					creator: [json.user_id],
				})
				let myInfo = await User.join_group({
					group_id: group._id.toString(),
					user_id: json.user_id
				})
				socket.emit('get myInfo', myInfo)
			})

			socket.on('disconnect', async (json) => {
				console.log('disconnect');
				await User.update({
					user_id: myInfo.user_id
				}, {
						status: 'offline'
					})
			});
		});

		server.listen(port, async () => {
			console.log(` >>> server listen on http://localhost:${port}`);
		});
	})