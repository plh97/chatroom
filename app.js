const Koa = require('koa')
const path = require('path')
const static = require('koa-static')
const IO = require( 'koa-socket.io' )
const http = require('http');
const https = require('https');
const webpackMiddleware = require("koa-webpack-dev-middleware");
const webpack = require('webpack')
const app = new Koa()
const mongoose = require('mongoose');
const Router = require('koa-router');
const Chat = require('./src/server/routes/model/Chat.model');
const router = new Router();
const db = 'mongodb://localhost/sampsite';
const bodyParser = require('koa-bodyparser');
const staticPath = './dist'
mongoose.connect(db, {useMongoClient: true});
const connections = [];
let options = {}
let users=[]

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(require('koa-static')('./dist'));

router.get('/list',async ctx => {
   ctx.body = await Chat.find({})
 })

const io = new IO({
    namespace: '/'
})

let server = http.createServer(app.callback());
io.start(server, options/*, port, host */)

// io.on('join', async (ctx) => {
    // io.emit('msg', '[All]: ' + ctx.data + ' joind'); // use global io send borad cast
    // ctx.socket.broadcast('msg', '[All]: Hello guys, I\'m ' + ctx.data + '.'); // use current socket send a broadcast
    // ctx.socket.emit('msg', '[' + ctx.data + ']' + " Welcome to koa-socket.io !"); // just send to current user
// })

io.on('connect', async (ctx, next) => {
  const socket = ctx.socket;
  connections.push(socket)
  console.log('connected: %s sockets connected',connections.length)

  //Disconnect
  socket.on('disconnect',function(data){
    // if(!socket.userName) return;
    users.splice(users.indexOf(socket.userName),1)
    updateUsernames();
    connections.splice(connections.indexOf(socket),1)
    console.log('Disconnected: %s sockets connected', connections.length)
  })
  //send message
  socket.on('send message',async (ctx) => {
    io.socket.emit('new message',{msg:ctx.data,user:socket.userName})
      var chatContent = new Chat({
        userName: socket.userName,
        time: ctx.data.time,
        message: ctx.data.message
      });
      console.log("inner:",chatContent)
      chatContent.save(function(err) {});
  })

  //new user
  socket.on('new user',function(data,callback){
    callback(true);
    socket.userName=data.data;
    users.push(socket.userName);
    updateUsernames();
    console.log('users: ',users)
  });

  function updateUsernames(){
    io.socket.emit('get users',users)
  }
  // socket.on('send message', async (ctx) => {
  //   var chatContent = new Chat({
  //     userName: ctx.data.userName,
  //     time: ctx.data.time,
  //     content: ctx.data.content
  //   });
  //   console.log("inner:",chatContent)
  //   chatContent.save(function(err) {});


  //   socket.broadcast('new message', {
  //     userName: ctx.data.userName,
  //     time: ctx.data.time,
  //     content: ctx.data.content
  //   });
  // });
});

server.listen( process.env.PORT || 3000 )
https.createServer(app.callback()).listen(3001);

const config = require('./webpack.config')
app.use(webpackMiddleware(webpack(config), {
    noInfo: false,
    quiet: false,
    headers: { "X-Custom-Header": "yes" },
    stats: {
        colors: true
    }
}));
app.use(require("webpack-hot-middleware")(webpack(config)));