import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Manager, Socket } from "socket.io-client";

import { addMessage, scrollToEnd } from "@/store/reducer/room";
import { updateUserRoomMessage } from "@/store/reducer/user";
import { useAppDispatch } from "./app";

export default function useWebsocket(id: string) {
  const dispatch = useAppDispatch();
  let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  const connect = () => {
    if (!id) return;
    // connect
    const manager = new Manager("");
    socket = manager.socket(`/${id}`);
    socket.on("connect", () => {
      console.log("connected: ", id);
    });
    socket.on("message", (msg) => {
      dispatch(addMessage([msg]));
      dispatch(updateUserRoomMessage({ roomId: id, msg }));
      dispatch(scrollToEnd());
    });
    socket.on("error", (error) => {
      console.log("error: ", error);
    });
    socket.on("disconnect", (error) => {
      console.log("disconnect: ", error);
    });
  };
  return {
    connect,
    disconnect: () => {
      socket?.close();
    },
  };
}
