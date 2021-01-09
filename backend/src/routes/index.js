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
} = require('./user.js');
const { Upload } = require('./image.js');

const { sendMessage, getMessage, deleteMessage } = require('./message');
const { getRoom, deleteRoom, modifyRoom, addRoom } = require('./room');

module.exports = router
    // image
    .post('/upload', Upload)
    // user
    .post('/login', Login)
    .post('/logout', Logout)
    .post('/register', Register)
    .get('/userInfo', GetUserInfo)
    .get('/user', QueryUser)
    .put('/friend', AddFriend)
    .post('/userInfo', SetUserInfo)
    .get('/userImage', GetUserImage)
    // message
    .get('/message', getMessage)
    .post('/message', sendMessage)
    .delete('/message', deleteMessage)
    // room
    .put('/room', addRoom)
    .get('/room', getRoom)
    .post('/room', sendMessage)
    .delete('/room', deleteRoom)

