import { Context } from "koa";
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>;

export default function socket(server: HttpServer) {
  function getWS() {
    if (!io) {
      io = new Server(server, {
        cors: {
          credentials: true,
        },
      });
      io.on("connection", (socket) => {
        socket.on("disconnect", () => {
          console.log(`disconnect websocket!`);
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
