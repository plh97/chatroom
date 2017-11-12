const router = require('koa-router')();
const User = require('./user.js');
const Auth = require('./auth.js')


router
      .get('/auth', Auth.getCode)
      .get('/getauthuser', Auth.getAuthUser)

module.exports = router;
