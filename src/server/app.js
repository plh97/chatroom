//package
const Koa = require('koa');
const path = require('path');
const IO = require('koa-socket');
const json = require('koa-json');
const koaSend = require('koa-send');
const logger = require('koa-logger');
const static = require('koa-static');
const convert = require('koa-convert');
const koaStatic = require('koa-static');
const bodyparser = require('koa-bodyparser');
const rp = require('request-promise');

//local
const allRouter = require('./routes/index.js');
const Room = require('./models/Room.model');
const User = require('./models/User.model');

//application
const app = new Koa();
const io = new IO();

app
    .use(bodyparser())
    .use(json())
    .use(logger())
    .use(static(path.resolve( './dist'),{
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

//still useless
app.io.on('connection', async (ctx,json) => {
    console.log('connection');
});
//while you got into a room and init your room,you need this stuff
app.io.on('init room', async (ctx,data) => {
    let currentRoomInfo = await Room.findOne({ name: 'MoonLight' })
    currentRoomInfo.messageList = currentRoomInfo.messageList.map(message=>{
        return message = {
            ...message,
            userName:'...',
            userAvatorUrl:'...'
        }
    })
    currentRoomInfo.memberList = currentRoomInfo.memberList.map(userId=>{
        return userId = {
            userName:'...',
            userAvatorUrl:'...'
        }
    })
    currentRoomInfo.administratorList = currentRoomInfo.administratorList.map(userId=>{
        return userId = {
            id:userId,
            userName:'...',
            userAvatorUrl:'...'
        }
    })
    currentRoomInfo.creator = {
        id:currentRoomInfo.creator,
        userName:'userName'
    }
    ctx.socket.emit('init room',currentRoomInfo)
});
//while your first got my page ,your must got your personal info,
//if you has token you can got here
app.io.on('get myInfo', async (ctx,data) => {
    //check your token
    // console.log(token);
    option = {
        uri: `https://api.github.com/user`,
        qs: {
            access_token: data.id.split('=')[1]
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    }
    let myInfo = await rp(option);
    myInfo = await User.findOne({_id: myInfo.id})
    ctx.socket.emit('get myInfo',myInfo)
});
app.io.on('send message', async (ctx,data) => {
    ctx.socket.emit('send message',data)
});
app.io.on('disconnect', async (ctx) => {
    console.log('disconnect');
});
// 不能去掉下面这行
// app.io.on('message', () => { });

module.exports = app;
