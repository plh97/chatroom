const http = require('http')
// const https = require('https')
const App = require('koa');
const app = new App()
const server = http.createServer(app.callback());
// const servers = https.createServer(app.callback());
const io = require('socket.io')(server);
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const webpack = require('webpack');
const webpackMiddleware = require('koa-webpack-dev-middleware');
const staticPath = './dist';
const mongoose = require('mongoose');
const Chat = require('./src/server/routes/model/Chat.model');
const Login = require('./src/server/routes/model/Login.model');
const Room = require('./src/server/routes/model/Room.model');
const jwt = require('jwt-simple');
console.log("process.env.NODE_ENV :",process.env.NODE_ENV )
if (process.env.NODE_ENV === 'production') {
  const db = 'mongodb://112.74.63.84/sampsite';
  mongoose.connect(db, {useMongoClient: true});
}else{
  const db = 'mongodb://127.0.0.1/sampsite';
  mongoose.connect(db, {useMongoClient: true});
}

const connections = []
let users=[]
let usersInfo=[]
let islogin = []
let tokenList = []
let tokeningList = []
app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(require('koa-static')(staticPath));

// router.get('/list',async (ctx,next) => { 
//   var html = await Chat.find({})
//   var users = await Login.find({})
//   html.map((index,i)=>{
//     index.avatorUrl = users.find( user =>{
//       return user.userName === index.userName;
//     }).avatorUrl
//   })
//   ctx.body = await html
// })



router.get('/chat',async ctx => {
  ctx.redirect('/')
})

router.get('/chat/room/:id',async ctx => {
  ctx.redirect('/')
})

router.get('/register',async ctx => {
  ctx.redirect('/')
})
//Todos
//0:跳转到chat,前台写入cookies
//1:发送信息
//2:跳转到chat，不写cookie
// router.post('/islogin',async (ctx,next) => new Promise((resolve, reject) => {
//   let postData = ctx.request.body
//   let token = postData.token

//   if(islogin.indexOf(token)===-1){
//     ctx.body = {info:'未登陆',message:'请登陆',code:1}
//     resolve()
//   }else if(islogin.indexOf(token)>=0){
//     Login
//       .find({userName: jwt.decode(token,'jwt').userName})
//       .exec(function(err,db){
//         if(db.length>0){
//           ctx.body = {
//             info:'已登录',
//             message:'已经登录',
//             code:2,
//             userName:db[0].userName,
//             avatorUrl:db[0].avatorUrl,
//             token:token
//           }
//           resolve()
//         }else{
//           ctx.body = {info:'Unknow worse',message:'should not show'}
//           resolve()
//         }
//       })
//   }
// }))

//login
// router.post('/login',async (ctx,next) => new Promise((resolve, reject) => {
//   let postData = ctx.request.body
//   const token = jwt.encode({ userName: postData.userName } , 'jwt');
// 	Login
// 		.find({userName: postData.userName})
// 		.exec(function(err,db){
// 			if(db.length == 1){
//         //如果能查找到，用户名对了
//         if(db[0].passWord == postData.passWord){
//           //密码对了
//           islogin.push(token)
//           ctx.body = {
//             info:'passWord right',
//             message:'密码正确',
//             code:0,
//             token:token,
//             avatorUrl:db[0].avatorUrl?db[0].avatorUrl:'',
//             userName:db[0].userName
//           }
// 				  resolve()
//         }else{
//           //密码错误
//           ctx.body = {
//             info:'passWord wrong',
//             message:'密码错误',
//             code:1
//           }
// 				  resolve()
//         }
// 			}else{
// 				//用户名错了
//         ctx.body = {
//           info:'userName no find',
//           message:'用户名未注册',
//           code:1
//         }
// 				resolve()
// 			}
// 		})
// }))
//register
// router.post('/register',async (ctx,next) => new Promise((resolve, reject) => {
// 	let postData = ctx.request.body
//   const token = jwt.encode({ userName: postData.userName } , 'jwt');
// 	Login
// 		.find({userName: postData.userName})
// 		.exec(function(err,db){
// 			if(db.length==1){
// 				//如果能查找到，用户名被注册了
// 				ctx.body = {
//           info:'userName has been used',
//           message:'该用户名已注册了',
//           code:1
//         }
// 				resolve()
// 			}else{
// 				//用户名未被注册
// 				var signUp = new Login({
// 					userName: postData.userName,
// 					passWord: postData.passWord,
//           avatorUrl:''
// 				});
//         signUp.save(function(err) {});
//         islogin.push(token)
// 				ctx.body = {
//           info:'signUp successed',
//           message:'注册成功',
//           token:token,
//           code:0,
//           userName:postData.userName,
//           avatorUrl:''
//         }
// 				resolve()
// 			}
// 		})
// }))




// io.on('connection', async socket => {
//   connections.push(socket)
//   console.log('connected: %s sockets connected',connections.length)
//   let html = await Chat.find({})
//   let users = await Login.find({})
//   html.map((index,i)=>{
//     index.avatorUrl = users.find( user =>{
//       return user.userName === index.userName;
//     }).avatorUrl
//   })
//   io.emit("get list", await html);
//   //login
//   socket.on('login',function(userInfo){
//     users.push(userInfo.userName);
//     console.log('userInfo',users)
//     usersInfo.push(userInfo);
//     io.emit("get users",usersInfo);
//     socket.userName = userInfo.userName
//     //send message
//     let time = new Date()
//     time = time.getMonth()+1+"月"+time.getDate()+"日" +" "+ ( time.getHours() < 10 ? '0'+time.getHours() : time.getHours() ) +":" + (time.getMinutes() < 10 ? '0'+time.getMinutes() : time.getMinutes())
//     socket.on('send message',function(msg){
//       const chatContent = new Chat({
//         userName: userInfo.userName,
//         time: time,
//         message: msg.msg,
//         code:msg.code,
//         imageUrl: msg.imageUrl,
//         type: msg.type,
//       });
//       chatContent.save(function(err) {});
//       io.emit('send message',{
//         message:msg.msg,
//         code:msg.code,
//         time: time,
//         userName:userInfo.userName,
//         imageUrl:msg.imageUrl,
//         avatorUrl:msg.avatorUrl,
//         type: msg.type,
//       })
//     })
//   });
//   socket.on('change avator',async e=>{
//     usersInfo.map((info,i)=>{
//       if(info.userName==e.userName){
//         info.avatorUrl = e.avatorUrl
//       }
//     })
//     await Login.update(
//       { userName: e.userName },
//       { userName: e.userName ,
//         avatorUrl: e.avatorUrl
//     })
//     io.emit("get users",usersInfo);
//   })
//   //while disconnect
//   socket.on('disconnect',function(data){
//     console.log('socket.userName',socket.userName)
//     console.log('users',users.indexOf(socket.userName))
//     if(socket.userName) {
//       usersInfo.splice(users.indexOf(socket.userName),1)
//       users.splice(users.indexOf(socket.userName),1)
//     }
//     connections.splice(connections.indexOf(socket),1)
//     console.log('Disconnected: %s sockets connected', connections.length)
//     io.emit("get users",usersInfo);
//   })
//   io.emit("get users",usersInfo);
// });

// io.on('connection', async socket => {
  // connections.push(socket)
  // console.log('connected: %s sockets connected',connections.length)
  // let html = await Chat.find({})
  // let users = await Login.find({})
  // html.map((index,i)=>{
  //   index.avatorUrl = users.find( user =>{
  //     return user.userName === index.userName;
  //   }).avatorUrl
  // })
  // io.emit("get list", await html);
  //login
  //while disconnect
//   socket.on('disconnect',function(data){
//     connections.splice(connections.indexOf(socket),1)
//     console.log('Disconnected: %s sockets connected', connections.length)
//     io.emit("get users",usersInfo);
//   })
//   io.emit("get users",usersInfo);
// });



let userName;
let token;
let signUp;
let userId;
let List;
let roomsList;
let usersForFound;
let ListContainer;


// io.on('connection', function (socket) {
//   socket.join('some room');

//   io.to('some room').emit('some event');
// })

var nsp = io.of('/my-namespace');
nsp.on('connection', function(socket){
  console.log('someone connected');
});
nsp.emit('hi', 'everyone!');



// io.on('connection', function (socket) {
//   socket.defaultRoom = "Moonlight"
//   socket.on('login', async json => {
//     if(!json.userName && json.token){
//       if(tokenList.indexOf(json.token) === -1){
//         socket.emit('user joined', {
//           info:'未登陆',
//           message:'请登陆',
//           code:1
//         });
//       }else if(tokenList.indexOf(json.token) >= 0){
//         socket.token = json.token
//         tokenList.splice(tokenList.indexOf(socket.token),1)
//         tokeningList.push(socket.token)
//         Login
//           .find({userName: jwt.decode(json.token,'jwt').userName})
//           .exec( async (err,db) => {
//             if(db.length>0){
//               //如果该token解码的用户名可以在数据库找到
//               socket.userName = db[0].userName;
//               users.push(db[0].userName)
//               // usersForFound = await Login.find({})
//               //我需要将该用户所在所有的房间名字列表发送到前台
//               //房间列表
//               List = await Room.find({})
//               roomsList = List.filter( index =>{
//                 return index.members.indexOf(db[0].userId)>-1
//               })
//               roomsList = roomsList.map( index => {
//                 return Object.assign({},index._doc,{
//                   usersName:[...index.members.map( memberId => {
//                     let ListContainer = usersForFound.find( userInfo =>{
//                       return memberId === userInfo.userId;
//                     })
//                     return {
//                       userName: ListContainer.userName,
//                       avatorUrl: ListContainer.avatorUrl
//                     }
//                   })]
//                 })
//               })
//               io.emit('get roomsList', roomsList);
//               io.emit('get users', users);
//               socket.emit('user joined', {
//                 info:'已登录',
//                 message:'已经登录',
//                 code:2,
//                 userId: db[0].userId,
//                 userName: db[0].userName,
//                 avatorUrl: db[0].avatorUrl,
//                 numUsers: users.length,
//                 token: json.token
//               });
//             }else{
//               socket.emit('user joined', {
//                 info: 'Unknow worse',
//                 message: 'should not show',
//                 numUsers: users.length
//               });
//             }
//           })
//       }
//     }else if(json.userName && json.passWord){
//       if(json.type == 'login'){
//         Login
//           .find({userName: json.userName})
//           .exec( async (err,db) => {
//             socket.token = jwt.encode({ userName: json.userName } , 'jwt');
//             if(tokeningList.indexOf(socket.token) == -1 && db.length == 1){
//               //if password right,can login
//               if(db[0].passWord == json.passWord){
//                 socket.userName = json.userName;
//                 users.push(db[0].userName)
//                 usersForFound = await Login.find({})
//                 List = await Room.find({roomName:socket.defaultRoom})
//                 roomsList = List.filter( index =>{
//                   return index.members.indexOf(db[0].userId)>-1
//                 })
//                 roomsList = roomsList.map( index => {
//                   return Object.assign({},index._doc,{
//                     usersName:[...index.members.map( memberId => {
//                       let ListContainer = usersForFound.find( userInfo =>{
//                         return memberId === userInfo.userId;
//                       })
//                       return {
//                         userName: ListContainer.userName,
//                         avatorUrl: ListContainer.avatorUrl
//                       }
//                     })]
//                   })
//                 })
//                 io.emit('get roomsList', roomsList);
//                 io.emit('get users', users);
//                 // tokenList.push(token)
//                 socket.emit('user joined', {
//                   info:'passWord right',
//                   message:'密码正确',
//                   numUsers: users.length,
//                   code:0,
//                   userId: db[0].userId,
//                   token:socket.token,
//                   avatorUrl:db[0].avatorUrl?db[0].avatorUrl:'',
//                   userName:db[0].userName
//                 });
//               }else{
//                 socket.emit('user joined', {
//                   info:'passWord wrong',
//                   message:'密码错误',
//                   code:1
//                 });
//               }
//             }else if(tokeningList.indexOf(socket.token) != -1){
//               socket.emit('user joined', {
//                 info:'userName not allow to login repeat',
//                 message:'用户不可被重复登陆',
//                 code:1
//               });
//             }else{
//               socket.emit('user joined', {
//                 info:'userName no find',
//                 message:'用户名未注册',
//                 code:1
//               });
//             }
//         })
//       }else if(json.type == 'register'){
//         Login
//           .find({userName: json.userName})
//           .exec( async (err,db) => {
//             if(db.length==1){
//               //如果能查找到，用户名被注册了
//               socket.emit('user joined', {
//                 info:'userName has been used',
//                 message:'该用户名已注册了',
//                 code:1
//               });
//             }else{
//               //用户名未被注册
//               socket.userName = json.userName;
//               socket.userId = jwt.encode({ userName: json.userName,random:Math.random() } , 'jwt' )
//               socket.token = jwt.encode({ userName: json.userName } , 'jwt');
//               users.push(json.userName)
//               io.emit('get users', users);
//               //注册用户名密码
//               signUp = new Login({
//                 userId: socket.userId,
//                 userName: json.userName,
//                 passWord: json.passWord,
//                 avatorUrl: ''
//               });
//               signUp.save(function(err) {});
//               //更新room里面的users数组，将新用户添加进去
//               Room
//                 .find({roomName : socket.defaultRoom})
//                 .exec( async (err,db) => {
//                   if(db.length==0){
//                     //如果找不到，新建一个房间
//                     RoomList = new Room({
//                       roomName : socket.defaultRoom,
//                       creator: socket.userId,
//                       administrator : [socket.userId]
//                     });
//                     RoomList.save( async(err) => {
//                       //无论有无默认房间，无则先创建了新房间，加入默认房间，有则加入默认房间
//                       await Room.update(
//                         { roomName : socket.defaultRoom },
//                         { $push :{members: socket.userId} }
//                       )
//                     });
//                   }else if(db.length>0){
//                     //无论有无默认房间，无则先创建了新房间，加入默认房间，有则加入默认房间
//                     await Room.update(
//                       { roomName : socket.defaultRoom },
//                       { $push :{members: socket.userId} }
//                     )
//                   }
//                 })
              
//               usersForFound = await Login.find({})
//               List = await Room.find({roomName:socket.defaultRoom})
//               //首先将该用户id所在的房间筛选出来
//               roomsList = List.filter( index =>{
//                 return index.members.indexOf(socket.userId)>-1
//               })
//               roomsList = roomsList.map( index => {
//                 return Object.assign({},index._doc,{
//                   usersName:[...index.members.map( memberId => {
//                     let ListContainer = usersForFound.find( userInfo =>{
//                       return memberId === userInfo.userId;
//                     })
//                     return {
//                       userName: ListContainer.userName,
//                       avatorUrl: ListContainer.avatorUrl
//                     }
//                   })]
//                 })
//               })
//               io.emit('get roomsList', roomsList);
//               io.emit('get users', users);
//               // tokenList.push(token)
//               socket.emit('user joined', {
//                 info:'signUp successed',
//                 message:'注册成功',
//                 token:socket.token,
//                 userId: socket.userId,
//                 numUsers: users.length,
//                 code:0,
//                 userName:json.userName,
//                 avatorUrl:''
//               });
//             }
//           })
//       }
//     }
//   });

//   //get messagesList
//   //can get one room's message , such as room Moonlight
//   socket.on('get messagesList',async index =>{
//     let html = await Room.find({roomName:index.roomName})
//     let users = await Login.find({})
//     let members = html[0].members
//     html = html[0].messagesList.map( message => {
//       let userInfo = users.find(user => {
//         return user.userId === message.userId;
//       })
//       return Object.assign({}, message, {
//         userName : userInfo.userName,
//         avatorUrl : userInfo.avatorUrl,
//         userId : null
//       })
//     })
//     index.emit("get messagesList",await {
//       messagesList:html,
//       members:members,
//       nowRoom:index.roomName,
//     });
//   })

//   //send message
//   socket.on('send message',async msg =>{
//     const chatContent = new Chat({
//       text: msg.text,
//       code:msg.code,
//       image: msg.image,
//       userId: msg.userId,
//       type: msg.type,
//     });
//     await Room.update(
//       { roomName : msg.nowRoom },
//       { $push :{messagesList: chatContent} }
//     )
//     io.emit('send message',{
//       text: msg.text,
//       code:msg.code,
//       image: msg.image,
//       userId: msg.userId,
//       type: msg.type,
//       userName: msg.myName,
//       userAvatorUrl: msg.myAvatorUrl,
//       createTime:chatContent.createTime,
//       nowRoom: msg.nowRoom,
//     })
//   })

//   //add room
//   socket.on('add room',async room =>{
//     console.log(room)
//     Room
//       .find({roomName : room.roomName})
//       .exec( async (err,db) => {
//         if(db.length==0){
//           //如果找不到，新建一个房间
//           RoomList = new Room({
//             roomName : room.roomName,
//             creator : room.userId,
//             administrator : [room.userId],
//             members : [room.userId],
//             messagesList: []
//           });
//           RoomList.save( (err) => {
//             socket.emit('add room',RoomList)
//           });
//         }else if(db.length>0){
//           //房间名字已经被使用过了，请换一个
//           socket.emit('add room',{
//             info:'has been used',
//             code:0,
//             message:'房间名字已经被使用过了，请换一个'
//           })
//         }
//       })
//   })

//   socket.on('disconnect', function () {
//     console.log('Disconnected: %s sockets connected', users.length)
//     if(socket.userName) {
//       socket.token && tokenList.push(socket.token)
//       tokeningList.splice(tokenList.indexOf(socket.token),1)
//       users.splice(users.indexOf(socket.userName),1)
//     }
//     io.emit('get users', users);
//   });
// });

server.listen(8080);
if (process.env.NODE_ENV !== 'production') {
  const config = require('./webpack.config')
  app.use(webpackMiddleware(webpack(config), {
    stats: {colors: true}
  }));
}