const router = require('koa-router')({ prefix: '/api' });
const {
    Login,
    Logout,
    Register,
    UserInfo,
    GetUserImage
} = require('./user.js');

const { sendMessage, getMessage, deleteMessage } = require('./message');

module.exports = router
    .post('/login', Login)
    .post('/logout', Logout)
    .post('/register', Register)
    .get('/userInfo', UserInfo)
    .get('/userImage', GetUserImage)
    .get('/message', getMessage)
    .post('/message', sendMessage)
    .delete('/message', deleteMessage)
