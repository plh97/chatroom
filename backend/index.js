const Koa = require('koa');
const jwt = require('koa-jwt');
const path = require('path');
const json = require('koa-json');
const cors = require('@koa/cors');
// const koaSend = require('koa-send');
const logger = require('koa-logger');
const kosStatic = require('koa-static');
const bodyparser = require('koa-bodyparser');
const allRouter = require('./routes/index.js');
const { privateKey } = require('./config');
require('./mongo')

const app = new Koa();
const port = process.env.PORT || 9002;
const whiteList = ['/api/login', '/api/register']

app
  .use(logger())
  .use(bodyparser())
  .use(json())
  .use(cors({
    maxAge: 1000 * 60 * 60 * 24 * 7,
    origin: 'http://localhost:3000',
    credentials: true
  }))
  .use(kosStatic(path.resolve('./dist'), {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    gzip: true,
  }))
  .use(
    jwt({
      secret: privateKey,
      getToken: (ctx) => ctx.cookies.get('token')
    }).unless({ path: whiteList })
  )
  .use(allRouter.routes())
  .use(allRouter.allowedMethods())

app.listen(port, () => {
  console.log(`listening at port ${port}`)
})