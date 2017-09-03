// const Koa = require('koa')
// const path = require('path')
// const static = require('koa-static')
// const IO = require( 'koa-socket.io' )
// const http = require('http');
// const https = require('https');
// const webpackMiddleware = require("koa-webpack-dev-middleware");
// const webpack = require('webpack')
// const app = new Koa()
const mongoose = require('mongoose');
// const Router = require('koa-router');
const Chat = require('./src/server/routes/model/Chat.model');
// const router = new Router();
const db = 'mongodb://localhost/sampsite';
// const bodyParser = require('koa-bodyparser');
// const staticPath = './dist'
mongoose.connect(db, {useMongoClient: true});
// const connections = [];
// let options = {}
// let users=[]

// app
//   .use(bodyParser())
//   .use(router.routes())
//   .use(router.allowedMethods())
//   .use(require('koa-static')('./dist'));

// router.get('/list',async ctx => {
//    ctx.body = await Chat.find({})
//  })

// const io = new IO({
//     namespace: '/'
// })

// let server = http.createServer(app.callback());
// io.start(server, options/*, port, host */)

// io.on('connect', async (ctx, next) => {
//   const socket = ctx.socket;
//   connections.push(socket)
//   console.log('connected: %s sockets connected',connections.length)

//   //Disconnect
//   socket.on('disconnect',function(data){
//     // if(!socket.userName) return;
//     users.splice(users.indexOf(socket.userName),1)
//     updateUsernames();
//     connections.splice(connections.indexOf(socket),1)
//     console.log('Disconnected: %s sockets connected', connections.length)
//   })
//   //send message
//   socket.on('send message',async (ctx) => {
//     io.socket.emit('new message',{msg:ctx.data,user:socket.userName})
//       var chatContent = new Chat({
//         userName: socket.userName,
//         time: ctx.data.time,
//         message: ctx.data.message
//       });
//       console.log("inner:",chatContent)
//       chatContent.save(function(err) {});
//   })

//   //new user
//   socket.on('new user',function(data,callback){
//     callback(true);
//     socket.userName=data.data;
//     users.push(socket.userName);
//     updateUsernames();
//     console.log('users: ',users)
//   });

//   function updateUsernames(){
//     io.socket.emit('get users',users)
//   }
// });

// server.listen( process.env.PORT || 3000 )

// const config = require('./webpack.config')
// app.use(webpackMiddleware(webpack(config), {
//     noInfo: false,
//     quiet: false,
//     headers: { "X-Custom-Header": "yes" },
//     stats: {
//         colors: true
//     }
// }));



// const static = require('koa-static')
// const Koa = require('koa')
// const app = new Koa()
// const router = require('koa-router')()
// const bodyParser = require('koa-bodyparser');
// const http = require('http')
// const port = process.env.PORT || 80


// const staticPath = './'
// app
//   .use(bodyParser())
//   .use(router.routes())
//   .use(router.allowedMethods())
//   .use(require('koa-static')(staticPath));



// router.get('/list',async ctx => {
//   ctx.body = "await Chat.find({})"
// })

// const server = http.createServer(app.callback())
// const io = require('socket.io')(server, {
//   serveClient: false,
//   // below are engine.IO options
//   pingInterval: 10000,
//   pingTimeout: 5000,
//   cookie: false
// });

// io.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log("on: ",data);
//   });
// });


// server.listen(port,function(){
//   console.log("success listen %d",port)
// })

var http = require('http')
var App = require('koa');
var app = new App()
var server = http.createServer(app.callback());
var io = require('socket.io')(server);
var static = require('koa-static')
var bodyParser = require('koa-bodyparser')
const router = require('koa-router')();
const webpack = require('webpack')
const webpackMiddleware = require('koa-webpack-dev-middleware')
const staticPath = './dist'

const connections = [];
let options = {}
let users=[]


app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(require('koa-static')(staticPath));


router.get('/list',async ctx => {
  ctx.body = await Chat.find({})
})

io.on('connection', function (socket) {
  //users.length
  //while connect
  connections.push(socket)
  console.log('connected: %s sockets connected',connections.length)
  //while disconnect
  socket.on('disconnect',function(data){
    // if(!socket.userName) return;
    users.splice(users.indexOf(socket.userName),1)
    connections.splice(connections.indexOf(socket),1)
    console.log('Disconnected: %s sockets connected', connections.length)
    io.emit("get users",users);
  })

  io.emit("get users",users);

  //login
  socket.on('login',function(name){
    users.push(name);
    console.log('users:',users)
    io.emit("get users",users);

    //send message
    socket.on('send message',function(msg){
      var chatContent = new Chat({
        userName: name,
        time: msg.time,
        message: msg.msg
      });
      console.log("inner:",chatContent)
      chatContent.save(function(err) {});
      io.emit('send message',{message:msg.msg,time:msg.time,userName:name})
    })
  });

 
});


server.listen(80);
server.listen(3000);



// const config = require('./webpack.config')
// app.use(webpackMiddleware(webpack(config), {
//     noInfo: false,
//     quiet: false,
//     headers: { "X-Custom-Header": "yes" },
//     stats: {
//         colors: true
//     }
// }));