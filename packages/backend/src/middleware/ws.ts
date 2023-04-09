import { Context } from "koa";
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export default function socket(server: HttpServer) {
  function getWS() {
    if (!io) {
      io = new Server(server, {
        cors: {
          credentials: true,
        },
      });
      io.on("connection", (socket) => {
        console.log(`connect room!`);
        socket.on("disconnect", () => {
          console.log(`disconnect room!`);
        });
      });
    }
    return io;
  }
  getWS();
  return async function socket(ctx: Context, next: () => Promise<void>) {
    ctx.getWS = getWS;
    await next();
  };
}
