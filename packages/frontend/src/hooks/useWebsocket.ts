import { addMessage, scrollToEnd } from "@/store/reducer/room";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket, Manager } from "socket.io-client";
import { useAppDispatch } from "./app";

export function useWebsocket(id: string) {
  const dispatch = useAppDispatch();
  let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  const connect = () => {
    if (!id) return;
    // connect
    const manager = new Manager(`ws://${document.domain}:9003`, {
      withCredentials: true,
      reconnectionDelayMax: 10000,
      query: {
        namespace: id,
      },
    });
    socket = manager.socket(`/${id}`);
    socket.on("connect", () => {
      console.log("connected: ", id);
    });
    socket.on("message", (msg) => {
      dispatch(addMessage([msg]));
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
