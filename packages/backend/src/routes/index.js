const router = require('koa-router')({ prefix: '/api' });
const {
    Login,
    Logout,
    Register,
    GetUserInfo,
    SetUserInfo,
    GetUserImage,
    QueryUser,
    AddFriend,
    DeleteFriend,
} = require('./user.js');
const { Upload } = require('./image.js');

// const { getMessage, deleteMessage } = require('./message');
const { addRoom, getRoom, deleteRoom, modifyRoom, addMessage, deleteMessage } = require('./room');

module.exports = router
    // image
    .post('/upload', Upload)
    // user
    .post('/login', Login)
    .post('/logout', Logout)
    .post('/register', Register)
    .get('/userInfo', GetUserInfo)
    .get('/user', QueryUser)
    .post('/friend', AddFriend)
    .delete('/friend', DeleteFriend)
    .post('/userInfo', SetUserInfo)
    .get('/userImage', GetUserImage)
    // message
    // .get('/message', getMessage)
    // .post('/message', sendMessage)
    // .delete('/message', deleteMessage)
    // room
    .post('/room', addRoom)
    .get('/room', getRoom)
    .patch('/room', modifyRoom)
    .delete('/room', deleteRoom)
    .post('/room/message', addMessage)
    .delete('/room/message', deleteMessage)
    // .get('/room/message', getMessage)
    // .post('/room/message', sendMessage)

