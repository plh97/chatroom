const Auth = require('./auth.js');
const Upload = require('./upload.js');
const Graphql = require('./graphql.js');
const router = require('koa-router')();
const koaBody = require('koa-body');


router
  .get('/auth', Auth)
  .all('/graphql', Graphql)
  .post('/upload', koaBody({ multipart: true }), Upload);

module.exports = router;
