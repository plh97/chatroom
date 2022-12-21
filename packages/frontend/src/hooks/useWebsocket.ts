import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useWebsocket(id: string) {
  const [ws, setWs] = useState<Socket>();
  const connect = () => {
    if (!id) return;
    // connect
    const socket = io(`ws://${document.domain}:9003/` + id);
    socket.on("connect", () => {
      console.log("connected: ", id);
      setWs(socket);
    });
    socket.on("error", (error) => {
      console.log("error: ", id);
    });
    socket.on("disconnect", (error) => {
      console.log(error, socket.nsp);
    });
  };
  return {
    connect,
    disconnect: () => ws?.close(),
  };
}
