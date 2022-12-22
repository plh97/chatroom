// import * as WebSocket from "ws";
import * as http from "http";

// const wsPool: Record<string, WebSocket.Server<WebSocket.WebSocket>> = {};

// const server = http.createServer().listen(9003);

// export const createWS = (id: string) => {
//   const wss = new WebSocket.WebSocketServer({
//     server,
//     // room id as namespace
//     path: `/${id}`,
//   });
//   wsPool[id] = wss;
//   return wss;
// };

// export const getWS = (id: string) => {
//   if (wsPool[id]) {
//     return wsPool[id];
//   }
//   return createWS(id);
// };

import { Server } from "socket.io";

const wsPool: Record<string, any> = {};

const server = http.createServer().listen(9003);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST"],
  },
});

export const createWS = (id: string) => {
  const namespace = io.of(`/${id}`).on("connect", (socket) => {
    console.log(`connect room: ${id}!`);
    socket.on("disconnect", () => {
      console.log(`disconnect room: ${id}!`);
    });
  });
  wsPool[id] = namespace;
  return namespace;
};

export const getWS = (id: string) => {
  if (wsPool[id]) {
    return wsPool[id];
  }
  return createWS(id);
};
