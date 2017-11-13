const Koa = require('koa');
const IO = require('koa-socket');
const koaSend = require('koa-send');
const koaStatic = require('koa-static');
const path = require('path');
const Socket = require('./models/socket');
const app = new Koa();

const 
    router = require('koa-router')(),
    logger = require('koa-logger'),
    static = require('koa-static'),
    bodyparser = require('koa-bodyparser'),
    json = require('koa-json'),
    convert = require('koa-convert');

const io = new IO();
io.attach(app);

const allRouter = require('./routes/index.js');
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
    .use(async (ctx, next) => {
        if (!/\./.test(ctx.request.url)) {
            await koaSend(
                ctx,
                'index.html',
                {
                    root: path.resolve('./dist'),
                    maxage: 1000 * 60 * 60 * 24 * 7,
                    gzip: true,
                } // eslint-disable-line
            );
        } else {
            await next();
        }
    });

// 静态文件访问
// app.use(koaStatic(
//     path.resolve( '/dist'),
//     // {
//     //     maxAge: 1000 * 60 * 60 * 24 * 7,
//     //     gzip: true,
//     // } // eslint-disable-line
// ));

// 注入应用

io.use( async ( ctx, next ) => {
    ctx.process = process.pid
    await next()
})

io.use(async (ctx, next) => {
    // ctx is passed along so ctx.process is now available
    console.log(ctx.process)
})


io
    // .use(bodyparser())
    // .use(json())
    // .use(logger())
    // .use(static(__dirname + '/public'))
    // .use(views(__dirname + '/views', {
        // extension: 'ejs'
    // }))
    // .use(convert(session(CONFIG, app)))
    // .use(async (ctx, next) => {
    //     // if(this.session.isNew) {
    //     //     console.log("not ")
    //     // } else {
    //     //     await allRouter.get('/login', async(ctx, next) => {
    //     //         await ctx.render('login');
    //     //     });
    //     // }
    //     console.log(ctx.session);
    // })
    .use(allRouter.routes())
    .use(allRouter.allowedMethods());







app.io.on('connection', async (ctx) => {
    console.log('connection');
    // await Socket.create({
    //     socket: ctx.socket.id,
    // });
    // const Auth = require('./routes/auth')
    // Auth.getCode()
    // console.log();

});
app.io.on('disconnect', async (ctx) => {
    console.log('disconnect');
    // await Socket.remove({
    //     socket: ctx.socket.id,
    // });
});
// 不能去掉下面这行
app.io.on('message', () => { });

module.exports = app;
