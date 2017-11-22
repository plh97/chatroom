//package
const Koa = require('koa');
const path = require('path');
const IO = require('koa-socket');
const json = require('koa-json');
const koaSend = require('koa-send');
const logger = require('koa-logger');
const static = require('koa-static');
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
    console.log('connection',json);
    let access_token = getCookie(ctx).access_token
    if (access_token) {
        //如果有cookie,进行下一步，验证token，通过就发送my info给前台
        let myInfo = await Token.verify(access_token)
        if(myInfo){
            ctx.socket.emit('get myInfo', myInfo)
        }
    }
});

app.io.on('init group', async (ctx, json) => {
    console.log('init group',json);
    let groupInfo = await Group.findOne({ group_name: json.groupName })
    //因为group里面administratorList,memberList,messageList类型都被写死了，不能更改，所以只能写个新变量
    let newGroupInfo = await {
        administratorList:groupInfo.administratorList,
        memberList:groupInfo.memberList,
        messageList:groupInfo.messageList,
        update_time:groupInfo.update_time,
        create_time:groupInfo.create_time,
        _id:groupInfo._id,
        creator:groupInfo.creator,
        avatar_url:groupInfo.avatar_url,
        group_name:groupInfo.group_name
    }
    if(groupInfo){
        newGroupInfo.administratorList = await Promise.all(groupInfo.administratorList.map(async user_id => {
            let user = await User.findOne({ user_id: user_id })
            return {
                user_name: user.github.name,
                avatar_url: user.github.avatar_url,
                user_id:user_id
            }
        }))
        newGroupInfo.memberList = await Promise.all(groupInfo.memberList.map(async user_id => {
            let user = await User.findOne({ user_id: user_id })
            return {
                user_name: user.github.name,
                avatar_url: user.github.avatar_url,
                user_id:user_id
            }
        }))
        newGroupInfo.messageList = await Promise.all(groupInfo.messageList.map(async message=>{
            let user = await User.findOne({user_id:message.user_id})
            return {
                user_id: message.user_id,
                _id: message._id,
                avatar_url: user.github.avatar_url,
                user_name: user.github.name,
                update_time: message.update_time,
                create_time: message.create_time,
                image: message.image,
                code: message.code,
                text: message.text,
                type: message.type,
            }
        }))
    } 
    ctx.socket.emit('init group', newGroupInfo)
})

app.io.on('user detail', async (ctx, json) => {
    console.log('user detail', json);
    let user = await User.findOne({ user_id: json.user_id })
    ctx.socket.emit('user detail', user)
})

app.io.on('send message', async (ctx, json) => {
    console.log('send message',json);
    let message = await Group.sendMsg(json)
    let user = await User.findOne({user_id:json.user_id})
    message = Object.assign({},message,{
        user_name:user.github.name,
        avatar_url:user.github.avatar_url,
        update_time: message.update_time,
        create_time: message.create_time,
    })
    app.io.broadcast('send message', message)
})

app.io.on('create group', async (ctx, json) => {
    console.log('create group',json);
    //流程
    //将群 创建者id发给 model, 返回group 信息 将信息中的
    let group = await Group.create(json)
    ctx.socket.emit('create group', group)
})

app.io.on('disconnect', async (ctx) => {
    console.log('disconnect');
});

module.exports = app;
