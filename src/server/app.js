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

const allRouter = require('./routes/index.js');
const Socket = require('./models/socket');

const app = new Koa();
const io = new IO();

app
    .use(bodyparser())
    .use(json())
    .use(logger())
    .use(static(path.resolve( './dist'),{
        maxAge: 1000 * 60 * 60 * 24 * 7,
        gzip: true,
    }))
    .use(allRouter.routes())
    .use(allRouter.allowedMethods())
    // 将前端路由指向 index.html
    // .use(async (ctx, next) => {
    //     if (!/\./.test(ctx.request.url)) {
    //         await koaSend(
    //             ctx,
    //             'index.html',
    //             {
    //                 root: path.resolve('./dist'),
    //                 maxage: 1000 * 60 * 60 * 24 * 7,
    //                 gzip: true,
    //             } // eslint-disable-line
    //         );
    //     } else {
    //         await next();
    //     }
    // });

// 注入应用
io.attach(app);

app.io.on('connection', async (ctx) => {
    console.log('connection');
});
app.io.on('disconnect', async (ctx) => {
    console.log('disconnect');
});
// 不能去掉下面这行
// app.io.on('message', () => { });

module.exports = app;
