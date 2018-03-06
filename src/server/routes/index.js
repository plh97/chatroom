const Auth = require('./auth.js');
const Test = require('./test.js');
const Upload = require('./upload.js');
const Graphql = require('./graphql.js');
const router = require('koa-router')();
const koaBody = require('koa-body');


router
  .get('/auth', Auth.getCode)
  .get('/test', Test.getCode)
  .get('/graphql', Graphql.getCode)
  .post('/upload', koaBody({ multipart: true }), Upload.getCode);

module.exports = router;
