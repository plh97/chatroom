const http = require('http')
// const https = require('https')
// const enforceHttps = require('koa-sslify');
const App = require('koa');
const app = new App()
// SSL options
// const fs = require('fs');
// const options = {
//     key: fs.readFileSync('./peng.pipk.top.key'),  //ssl文件路径
//     cert: fs.readFileSync('./peng.pipk.top.crt')  //ssl文件路径
// };

// start the server
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

let users=[]
let tokenList = []
let tokeningList = []
app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(require('koa-static')(staticPath))
  // .use(enforceHttps({
  //   trustAzureHeader: true
  // }))


router.get('/chat',async ctx => {
  ctx.redirect('/')
})

router.get('/chat/room/:id',async ctx => {
  ctx.redirect('/')
})

router.get('/register',async ctx => {
  ctx.redirect('/')
})


let userName;
let token;
let signUp;
let userId;
let List;
let roomList;
let usersForFound;
io.on('connection', function (socket) {
  socket.defaultRoom = "Moonlight"
  socket.userInfo={
    name:'',
    id:'',
    avatorUrl:'',
    token:'',
  }
  socket.currentRoomInfo={
    name:'',
    id:'',
    avatorUrl:''
  }
  socket.on('login', async json => {
    if(!json.userName && json.token){
      if(tokenList.indexOf(json.token) === -1){
        socket.emit('user joined', {
          info:'未登录',
          message:'请登录',
          code:1
        });
      }else if(tokenList.indexOf(json.token) >= 0){
        socket.userInfo.token = json.token
        tokenList.splice(tokenList.indexOf(socket.userInfo.token),1)
        tokeningList.push(socket.userInfo.token)
        Login
          .find({userName: jwt.decode(json.token,'jwt').userName})
          .exec( async (err,db) => {
            if(db.length>0){
              //如果该token解码的用户名可以在数据库找到
              socket.userInfo.name = db[0].userName;
              users.push(db[0].userName)
              //我需要将该用户所在所有的房间名字列表发送到前台
              //房间列表
              List = await Room.find({})
              roomList = List.filter( index =>{
                return index.memberList.indexOf(db[0].userId)>-1
              })
              roomList = roomList.map( index => {
                return {
                  name: index.name,
                  avatorUrl: index.avatorUrl
                }
              })
              socket.emit('get roomList', roomList);
              io.emit('get users', users);
              socket.emit('user joined', {
                info:'已登录',
                message:'已经登录',
                code:2,
                userId: db[0].userId,
                userName: db[0].userName,
                avatorUrl: db[0].avatorUrl,
                numUsers: users.length,
                token: json.token
              });
            }else{
              socket.emit('user joined', {
                info: 'Unknow worse',
                message: 'should not show',
                numUsers: users.length
              });
            }
          })
      }
    }else if(json.userName && json.passWord){
      if(json.type == 'login'){
        Login
          .find({userName: json.userName})
          .exec( async (err,db) => {
            socket.userInfo.token = jwt.encode({ userName: json.userName } , 'jwt');
            if(tokeningList.indexOf(socket.userInfo.token) == -1 && db.length == 1){
              //if password right,can login
              if(db[0].passWord == json.passWord){
                socket.userInfo.name = json.userName;
                users.push(db[0].userName)
                usersForFound = await Login.find({})
                List = await Room.find({})
                roomList = List.filter( index =>{
                  return index.memberList.indexOf(db[0].userId)>-1
                })
                roomList = roomList.map( index => {
                  return {
                    name: index.name,
                    avatorUrl: index.avatorUrl
                  }
                })
                socket.emit('get roomList', roomList);
                io.emit('get users', users);
                // tokenList.push(token)
                socket.emit('user joined', {
                  info:'passWord right',
                  message:'密码正确',
                  numUsers: users.length,
                  code:0,
                  userId: db[0].userId,
                  token:socket.userInfo.token,
                  avatorUrl:db[0].avatorUrl?db[0].avatorUrl:'',
                  userName:db[0].userName
                });
              }else{
                socket.emit('user joined', {
                  info:'passWord wrong',
                  message:'密码错误',
                  code:1
                });
              }
            }else if(tokeningList.indexOf(socket.userInfo.token) != -1){
              socket.emit('user joined', {
                info:'userName not allow to login repeat',
                message:'用户不可被重复登录',
                code:1
              });
            }else{
              socket.emit('user joined', {
                info:'userName no find',
                message:'用户名未注册',
                code:1
              });
            }
        })
      }else if(json.type == 'register'){
        Login
          .find({userName: json.userName})
          .exec( async (err,db) => {
            if(db.length==1){
              //如果能查找到，用户名被注册了
              socket.emit('user joined', {
                info:'userName has been used',
                message:'该用户名已注册了',
                code:1
              });
            }else{
              //用户名未被注册
              socket.userInfo.name = json.userName;
              socket.userInfo.id = jwt.encode({ userName: json.userName,random:Math.random() } , 'jwt' )
              socket.userInfo.token = jwt.encode({ userName: json.userName } , 'jwt');
              users.push(json.userName)
              io.emit('get users', users);
              //注册用户名密码
              signUp = new Login({
                userId: socket.userInfo.id,
                userName: json.userName,
                passWord: json.passWord,
                avatorUrl: ''
              });
              signUp.save(function(err) {});
              //更新room里面的users数组，将新用户添加进去
              Room
                .find({name : socket.defaultRoom})
                .exec( async (err,db) => {
                  if(db.length==0){
                    //如果找不到，新建一个房间
                    RoomList = new Room({
                      name : socket.defaultRoom,
                      creator: socket.userInfo.id,
                      administratorList : [socket.userInfo.id],
                      memberList : [socket.userInfo.id]
                    });
                    RoomList.save(function(err) {});
                  }else if(db.length>0){
                    //加入默认房间
                    await Room.update(
                      { name : socket.defaultRoom },
                      { $push :{memberList: socket.userInfo.id} }
                    )
                  }
                })
              usersForFound = await Login.find({})
              List = await Room.find({name:socket.defaultRoom})
              //首先将该用户id所在的房间筛选出来
              roomList = List.filter( index =>{
                return index.memberList.indexOf(socket.userInfo.id)>-1
              })
              roomList = roomList.map( index => {
                return {
                  name: index.name,
                  avatorUrl: index.avatorUrl
                }
              })
              socket.emit('get roomList', roomList);
              io.emit('get users', users);
              // tokenList.push(token)
              console.log('socket.userInfo',socket.userInfo)
              socket.emit('user joined', {
                info:'signUp successed',
                message:'注册成功',
                token:socket.userInfo.token,
                userId: socket.userInfo.id,
                numUsers: users.length,
                code:0,
                userName:socket.userInfo.name,
                avatorUrl:''
              });
            }
          })
      }
    }
  });

  //get currentRoomInfo
  //can get one room's message , such as room Moonlight
  socket.on("get currentRoomInfo",async index =>{
    socket.leave(socket.currentRoomInfo.name)
    let roomList = await Room.find({name:index.name})
    let users = await Login.find({})
    //1.把用户信息列表发过去，
    let memberList = roomList[0].memberList.map( member =>  {
      let userInfo = users.find(user => {
        return user.userId === member;
      })
      return {
        userName: userInfo.userName,
        avatorUrl: userInfo.avatorUrl,
        userId: userInfo.userId
      }
    })
    //2.把历史消息列表发出去
    //administrator
    let administratorList = roomList[0].administratorList.map((userId,i)=>{
      let userInfo = users.find(user => {
        return user.userId === userId;
      })
      return {
        userId: userInfo.userId,
        userName: userInfo.userName,
        avatorUrl: userInfo.avatorUrl
      }
    })
    //3.把历史消息列表发出去
    messageList = roomList[0].messageList.map( message => {
      let userInfo = users.find(user => {
        return user.userId === message.userId;
      })
      return Object.assign({}, message, {
        userName : userInfo.userName,
        avatorUrl : userInfo.avatorUrl,
        userId : null
      })
    })
    socket.currentRoomInfo = index;
    socket.join(socket.currentRoomInfo.name)
    socket.emit("get currentRoomInfo",await {
      messageList: messageList,
      memberList: memberList,
      administratorList: administratorList,
      name: socket.currentRoomInfo.name,
      avatorUrl:socket.currentRoomInfo.avatorUrl
    });
  })

  //send message
  socket.on('send message',async msg =>{
    const chatContent = new Chat({
      text: msg.text,
      code:msg.code,
      image: msg.image,
      userId: msg.userId,
      type: msg.type,
    });
    await Room.update(
      { name : msg.nowRoom },
      { $push :{messageList: chatContent} }
    )
    io.in(socket.currentRoomInfo.name).emit("send message" ,{
      text: msg.text,
      code:msg.code,
      image: msg.image,
      userId: msg.userId,
      type: msg.type,
      userName: msg.myName,
      userAvatorUrl: msg.myAvatorUrl,
      createTime:chatContent.createTime,
      nowRoom: msg.nowRoom,
    })
  })

  //add room
  socket.on('add room',async room =>{
    Room
      .find({name : room.name})
      .exec( async (err,db) => {
        if(db.length==0){
          //如果找不到，新建一个房间
          RoomList = new Room({
            name : room.name,
            creator : room.userId,
            administratorList : [room.userId],
            memberList : [room.userId],
            messageList: []
          });
          RoomList.save( (err) => {
            socket.emit('add room',RoomList)
          });
        }else if(db.length>0){
          //房间名字已经被使用过了，请换一个
          socket.emit('add room',{
            info:'has been used',
            code:0,
            message:'房间名字已经被使用过了，请换一个'
          })
        }
      })
  })

  socket.on('disconnect', function () {
    console.log('Disconnected: %s sockets connected', users.length)
    if(socket.userInfo.name) {
      socket.userInfo.token && tokenList.push(socket.userInfo.token)
      tokeningList.splice(tokenList.indexOf(socket.userInfo.token),1)
      users.splice(users.indexOf(socket.userInfo.name),1)
    }
    io.emit('get users', users);
  });
});

server.listen(8080);
// if (process.env.NODE_ENV !== 'production') {
//   const config = require('./webpack.config')
//   app.use(webpackMiddleware(webpack(config), {
//     stats: {colors: true}
//   }));
// }
