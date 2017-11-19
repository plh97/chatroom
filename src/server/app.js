//package
const Koa = require('koa');
const path = require('path');
const IO = require('koa-socket');
const json = require('koa-json');
// const cookie = require('cookie');
// const moment = require('moment');
const koaSend = require('koa-send');
const logger = require('koa-logger');
const static = require('koa-static');
// const rp = require('request-promise');
// const convert = require('koa-convert');
// const koaStatic = require('koa-static');
const bodyparser = require('koa-bodyparser');

//local
const allRouter = require('./routes/index.js');
const Group = require('./models/Group.model');
const User = require('./models/User.model');
const Token = require('./models/Token.model');

//utils
const getCookie = require('./utils/getCookie')

//application
const app = new Koa();
const io = new IO();

app
    .use(bodyparser())
    .use(json())
    .use(logger())
    .use(static(path.resolve('./dist'), {
        // maxAge: 1000 * 60 * 60 * 24 * 7,
        gzip: true,
    }))
    .use(allRouter.routes())
    .use(allRouter.allowedMethods())
    // 将前端路由指向 index.html
    .use(async (ctx, next) => {
        if (!/\./.test(ctx.request.url)) {
            await koaSend(
                ctx,
                'index.html',
                {
                    root: path.resolve('./dist'),
                    // maxage: 1000 * 60 * 60 * 24 * 7,
                    gzip: true,
                } // eslint-disable-line
            );
        } else {
            await next();
        }
    });

// 注入应用
io.attach(app);

/*
*   @param {cookie} string
*   @return {myinfo} 
*   连接上以后，
*   1)验证cookie的token，
*       1.如果通过那么他是用户，发my info给他。
*       2.如果不通过后台验证，那么他是游客，
*/
app.io.on('connection', async (ctx, json) => {
    console.log('connection');
    let access_token = getCookie(ctx).access_token
    if (access_token) {
        //如果有cookie,进行下一步，验证token，通过就发送my info给前台
        let myInfo = await Token.verify(access_token)
        myInfo && ctx.socket.emit('get myInfo', myInfo)
    }
});

app.io.on('init group', async (ctx, json) => {
    let groupInfo = await Group.findOne({ name: json.groupName })
    if(groupInfo){
        groupInfo.administratorList = await Promise.all(groupInfo.administratorList.map(async _id => {
            let user = await User.findOne({ _id: _id })
            return {
                name: user.github.name,
                avatar_url: user.github.avatar_url,
                _id
            }
        }))
        groupInfo.memberList = await Promise.all(groupInfo.memberList.map(async _id => {
            let user = await User.findOne({ _id: _id })
            return {
                name: user.github.name,
                avatar_url: user.github.avatar_url,
                _id
            }
        }))
        groupInfo.messageList = await Promise.all(groupInfo.messageList.map(async message=>{
            let user = await User.findOne({_id:message.id})
            return message = {
                id: message.id,
                _id: message._id,
                avatar_url: user.github.avatar_url,
                name: user.github.name,
                update_time: message.update_time,
                create_time: message.create_time,
                image: message.image,
                code: message.code,
                text: message.text,
                type: message.type,
            }
        }))
    } 
    ctx.socket.emit('init group', groupInfo)
})

app.io.on('user detail', async (ctx, json) => {
    console.log('user detail', json);
    let user = await User.findOne({ _id: json._id })
    ctx.socket.emit('user detail', user)
})

app.io.on('send message', async (ctx, json) => {
    console.log('send message',json);
    let message = await Group.sendMsg(json)
    let user = await User.findOne({_id:json.id})
    message = Object.assign({},message,{
        name:user.github.name,
        avatar_url:user.github.avatar_url,
        update_time: message.update_time,
        create_time: message.create_time,
    })
    ctx.socket.emit('send message', message)
})

app.io.on('disconnect', async (ctx) => {
    console.log('disconnect');
});

module.exports = app;
