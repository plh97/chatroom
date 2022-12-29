import * as http from "http";
import { Server } from "socket.io";

const wsPool: Record<string, any> = {};

const server = http.createServer().listen(9003);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
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
