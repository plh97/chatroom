const Auth = require('./auth.js')
const Test = require('./test.js')
var debug = require('debug')('koa-router');
const router = require('koa-router')()

router
      .get('/auth', Auth.getCode)
module.exports = router;
