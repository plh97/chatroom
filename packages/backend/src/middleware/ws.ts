import { Context } from "koa";
import { Namespace, Server } from "socket.io";
// import { app, server } from "..";
import { Server as HttpServer } from "http";

const wsPool: Record<string, Namespace> = {};

export default function socket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      // origin: `http://localhost:5173`,
      credentials: true,
    },
  });
  function createWS(id: string) {
    const namespace = io.of(`/${id}`).on("connect", (socket) => {
      console.log(`connect room: ${id}!`);
      socket.on("disconnect", () => {
        console.log(`disconnect room: ${id}!`);
      });
    });
    wsPool[id] = namespace;
    return namespace;
  }

  function getWS(id: string) {
    if (wsPool[id]) {
      return wsPool[id];
    }
    return createWS(id);
  }

  return async function socket(ctx: Context, next: () => Promise<void>) {
    ctx.createWS = createWS;
    ctx.getWS = getWS;
    await next();
  };
}
