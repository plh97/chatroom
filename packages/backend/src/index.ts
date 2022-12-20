import * as Koa from "koa";
import * as jwt from "koa-jwt";
import * as path from "path";
import * as json from "koa-json";
import * as cors from "@koa/cors";
import * as logger from "koa-logger";
import * as kosStatic from "koa-static";
import * as koaBody from "koa-body";
import allRouter from "./routes";
import { privateKey } from "./config";
import "./mongo";

const app = new Koa();
const BACKEND_PROT = process.env.PORT || process.env.BACKEND_PORT || 9002;
const whiteList = [
  "/api/login",
  "/api/logout",
  "/api/register",
  "/api/userImage",
  "/api/upload",
];

app
  .use(logger())
  .use(koaBody({ multipart: true }))
  .use(json())
  .use(
    cors({
      // origin: frontendOrigin,
      credentials: true,
      // maxAge: 1000 * 60 * 60 * 24 * 7,
    })
  )
  .use(kosStatic(path.resolve("static")))
  .use(
    kosStatic(path.resolve("public"), {
      gzip: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })
  )
  .use(
    jwt({
      secret: privateKey,
      getToken: (ctx: Koa.Context) => ctx.cookies.get("token") ?? "",
    }).unless({ path: whiteList })
  )
  // .use(async(ctx,next) => {
  //   const cookie = ctx.cookies.get('token')
  //   const userIdFromToken = await new Promise((resolve, reject) => {
  //     verify(cookie, privateKey, (err, token) => {
  //       if (err) reject(err);
  //       resolve(token);
  //     });
  //   });
  //   ctx.userid = userIdFromToken;
  //   next();
  // })
  .use(allRouter.routes())
  .use(allRouter.allowedMethods());

app.listen(BACKEND_PROT, () => {
  console.log(`listening at port ${BACKEND_PROT}`);
});
