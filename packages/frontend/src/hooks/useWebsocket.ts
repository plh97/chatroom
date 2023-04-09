import { DefaultEventsMap } from "@socket.io/component-emitter";
import { io, Socket } from "socket.io-client";
import { MESSAGE } from "@/interfaces/IMessage";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export default function useWebsocket() {
  // connect
  const connect = ({ id }: { id: string }, cb: (msg: MESSAGE) => void) => {
    if (!id) return;
    if (!socket) {
      socket = io();
      socket.on("connect", () => {
        console.log("connected: ", id);
      });
      socket.on("message", (msg) => {
        cb(msg);
      });
      socket.on("error", (error) => {
        console.log("error: ", error);
      });
      socket.on("disconnect", (error) => {
        console.log("disconnect: ", error);
      });
    }
  };
  return {
    subscribe: connect,
    disconnect: () => {
      socket?.close();
    },
  };
}
