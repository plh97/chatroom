const Auth = require('./auth.js')
const Test = require('./test.js')
var debug = require('debug')('koa-router');
const router = require('koa-router')()

router
      .get('/auth', Auth.getCode)
      .get('/test', Test.getCode)
module.exports = router;
