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
const Login = require('./src/server/routes/model/Login.model');
const Register = require('./src/server/routes/model/Register.model');
const jwt = require('jwt-simple');
if (process.env.NODE_ENV === 'development') {
  const db = 'mongodb://127.0.0.1/sampsite';
  mongoose.connect(db, {useMongoClient: true});
}else{
  const db = 'mongodb://112.74.63.84/sampsite';
  mongoose.connect(db, {useMongoClient: true});
}
const connections = []
let users=[]
let islogin = []
app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(require('koa-static')(staticPath));

router.all('/list',async (ctx,next) => new Promise((resolve, reject) => {
  let postData = ctx.request.body
  Chat
    .find().sort({_id:-1}).limit(30)
    .exec(function(err,db){
      ctx.body = db
      resolve()
    })
}))


router.get('/list1',async ctx => {
  ctx.body = await Chat.find({})
})

router.get('/chat',async ctx => {
  ctx.redirect('/')
})
router.get('/register',async ctx => {
  ctx.redirect('/')
})
//Todos
//0:跳转到chat,前台写入cookies
//1:发送信息
//2:跳转到chat，不写cookie
router.post('/islogin',async ctx => {
  let postData = ctx.request.body
  if(islogin.indexOf(postData.token)===-1){
    ctx.body = {info:'未登陆',message:'请登陆',code:1}
  }else if(islogin.indexOf(postData.token)>=0){
    ctx.body = {info:'已登录',message:'已经登录',code:2,userName:jwt.decode(postData.token,'jwt').userName}
  }
})

//login
router.post('/login',async (ctx,next) => new Promise((resolve, reject) => {
  let postData = ctx.request.body
  const token = jwt.encode({ userName: postData.userName } , 'jwt');
	Login
		.find({userName: postData.userName})
		.exec(function(err,db){
			if(db.length == 1){
        //如果能查找到，用户名对了
        if(db[0].passWord == postData.passWord){
          //密码对了
          islogin.push(token)
          ctx.body = {info:'passWord right',message:'密码正确',code:0,token:token,userName:postData.userName}
				  resolve()
        }else{
          //密码错误
          ctx.body = {info:'passWord wrong',message:'密码错误',code:1}
				  resolve()
        }
			}else{
				//用户名错了
        ctx.body = {info:'userName no find',message:'用户名未注册',code:1}
				resolve()
			}
		})
}))
//register
router.post('/register',async (ctx,next) => new Promise((resolve, reject) => {
	let postData = ctx.request.body
  const token = jwt.encode({ userName: postData.userName } , 'jwt');
	Login
		.find({userName: postData.userName})
		.exec(function(err,db){
			if(db.length==1){
				//如果能查找到，用户名被注册了
				ctx.body = {info:'userName has been used',message:'该用户名已注册了',code:1}
				resolve()
			}else{
				//用户名未被注册
				var signUp = new Login({
					userName: postData.userName,
					passWord: postData.passWord
				});
        signUp.save(function(err) {});
        islogin.push(token)
				ctx.body = {info:'signUp successed',message:'注册成功',token:token,code:0,userName:postData.userName}
				resolve()
			}
		})
}))

//socket.io
io.on('connection', function (socket) {
  //users.length
  //while connect
  connections.push(socket)
  console.log('connected: %s sockets connected',connections.length)
  //login
  socket.on('login',function(name){

    users.push(name);
    io.emit("get users",users);
    socket.userName = name
    //send message
    socket.on('send message',function(msg){
      console.log(msg)
      const chatContent = new Chat({
        userName: name,
        time: msg.time,
        message: msg.msg,
        imageUrl: msg.imageUrl,
        size: msg.size,
      });
      chatContent.save(function(err) {});
      io.emit('send message',{message:msg.msg,time:msg.time,userName:name,imageUrl:msg.imageUrl,size:msg.size})
    })
  });
  //while disconnect
  socket.on('disconnect',function(data){
    if(socket.userName) {
      users.splice(users.indexOf(socket.userName),1)
    }
    connections.splice(connections.indexOf(socket),1)
    console.log('Disconnected: %s sockets connected', connections.length)
    io.emit("get users",users);
  })
  io.emit("get users",users);
});
server.listen(80);
if (process.env.NODE_ENV == 'development') {
  const config = require('./webpack.config')
  app.use(webpackMiddleware(webpack(config), {
      headers: { "X-Custom-Header": "yes" },
      stats: {
          colors: true
      }
  }));
}