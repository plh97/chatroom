const router = require('koa-router')({ prefix: '/api' });
const {
    Login,
    Register,
    UserInfo,
    GetUserImage
} = require('./user.js');

const { sendMessage, getMessage } = require('./message');

module.exports = router
    .post('/login', Login)
    .post('/register', Register)
    .get('/userInfo', UserInfo)
    .get('/userImage', GetUserImage)
    .get('/message', getMessage)
    .post('/message', sendMessage)
