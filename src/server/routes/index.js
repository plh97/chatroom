const router = require('koa-router')();
const Auth = require('./auth.js')


router
      .get('/auth', Auth.getCode)
      // .get('/getauthuser', Auth.getAuthUser)

module.exports = router;
