const http = require('http')
const App = require('koa');
const app = new App()
const server = http.createServer(app.callback());
const io = require('socket.io')(server);
const static = require('koa-static')
const bodyParser = require('koa-bodyparser')
const router = require('koa-router')();
const webpack = require('webpack')
const webpackMiddleware = require('koa-webpack-dev-middleware')
const staticPath = './dist'
const mongoose = require('mongoose');
const Chat = require('./src/server/routes/model/Chat.model');
const db = 'mongodb://127.0.0.1/sampsite';
mongoose.connect(db, {useMongoClient: true});
const connections = [];
let users=[]
app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(require('koa-static')(staticPath));
router.get('/list',async ctx => {
  ctx.body = await Chat.find({})
})
console.log("outside")
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
      const chatContent = new Chat({
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
// const config = require('./webpack.config')
// app.use(webpackMiddleware(webpack(config), {
//     headers: { "X-Custom-Header": "yes" },
//     stats: {
//         colors: true
//     }
// }));