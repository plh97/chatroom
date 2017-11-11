const router = require('koa-router')();
const User = require('./user.js');
const Auth = require('./auth.js')


router
      .get('/login', User.renderLogin)
      .get('/signup', User.renderSignup)
      .post('/signup', User.signup)
      .post('/login', User.login)
      .get('/auth', Auth.getCode)
      .get('/getauthuser', Auth.getAuthUser)
      // .get('/', Home.renderIndex)

module.exports = router;
