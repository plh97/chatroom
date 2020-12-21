const Koa = require('koa');
const jwt = require('koa-jwt');
const path = require('path');
const json = require('koa-json');
const cors = require('@koa/cors');
// const koaSend = require('koa-send');
const logger = require('koa-logger');
const kosStatic = require('koa-static');
const koaBody = require("koa-body");
const allRouter = require('./routes');
const { privateKey } = require('./config');
require('./mongo')

const app = new Koa();
const BACKEND_PROT = process.env.PORT || process.env.BACKEND_PORT || 9002;
const whiteList = ['/api/login', '/api/logout', '/api/register', '/api/userImage', '/api/upload'];

app
  .use(logger())
  .use(koaBody({ multipart: true }))
  .use(json())
  .use(cors({
    // origin: frontendOrigin,
    credentials: true,
    // maxAge: 1000 * 60 * 60 * 24 * 7,
  }))
  .use(kosStatic(path.resolve('static'), {
    gzip: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }))
  .use(
    jwt({
      secret: privateKey,
      getToken: (ctx) => ctx.cookies.get('token')
    }).unless({ path: whiteList })
  )
  .use(allRouter.routes())
  .use(allRouter.allowedMethods())

app.listen(BACKEND_PROT, () => {
  console.log(`listening at port ${BACKEND_PROT}`)
})