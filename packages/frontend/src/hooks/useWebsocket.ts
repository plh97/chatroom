import { DefaultEventsMap } from "@socket.io/component-emitter";
import { io, Socket } from "socket.io-client";
import { MESSAGE } from "@/interfaces/IMessage";
import { EMPTY_FN } from "@/constants";

export type CHANNEL_TYPE = `room:${string}` | `userinfo:${string}`;

const socket: Socket<DefaultEventsMap, DefaultEventsMap> = io();
socket.on("connect", () => {
  console.log("connected: WS");
});
socket.on("error", (error) => {
  console.log("error: ", error);
});
socket.on("disconnect", (error) => {
  console.log("disconnect: ", error);
});

export default function useWebsocket() {
  const subscribe = (
    { channel }: { channel: CHANNEL_TYPE },
    cb: (msg: MESSAGE) => void
  ) => {
    if (!channel) return EMPTY_FN;
    console.log("do subscribe of: ", channel);
    socket.on(channel, cb);
    const unsbuscribe = () => {
      console.log("do un-subscribe channel:", channel);
      socket.off(channel, cb);
    };
    return () => {
      unsbuscribe();
    };
  };
  return {
    subscribe,
    disconnect: () => {
      socket?.close();
    },
  };
}
