import CSS from "csstype";
import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { getRoomInfoThunk, loadRoomMoreMessageThunk, IState } from "@/store/reducer/room";
import { useAppDispatch, useAppSelector } from "@/hooks/app";
import Message from "./Message";
import { Spinner } from "@chakra-ui/react";
import { useScroll } from "@/hooks/useScroll";
import { useWebsocket } from "@/hooks/useWebsocket";
// import WebSocket from "ws";

const style: { [key: string]: CSS.Properties } = {
  container: {
    flex: 1,
    padding: "0 0.8125rem",
  },
};

export default function Content() {
  const messageRef = useRef<HTMLDivElement[]>([]);
  const scrollEl = useRef<HTMLDivElement>(null);
  const { data: { message, totalCount }, loadingMessage } = useAppSelector<IState>((state) => state.room);
  const hasMessage = totalCount > message.length;
  const dispatch = useAppDispatch();
  const { id = "" } = useParams();
  useScroll(scrollEl);
  const { connect, disconnect } = useWebsocket(id)
  useEffect(() => {
    if (!id) return;
    dispatch(
      getRoomInfoThunk(id) as any
    ).then(() => {
      connect();
    })
    return () => {
      disconnect();
    }
  }, [id]);
  const handleScroll = async () => {
    // 如果滚动到了顶部
    if (message.length > 0 && scrollEl.current?.scrollTop === 0 && !loadingMessage && hasMessage) {
      const lastNode = messageRef.current[0];
      await dispatch(
        loadRoomMoreMessageThunk({
          page: Math.floor(message.length / 20) + 1,
          pageSize: 20,
          _id: id,
        }) as any
      )
      // 滚动到当前对话+loading图标高度的位置
      scrollEl.current.scrollTop = lastNode.offsetTop - 31 - 16;
    }
  };

  return (
    <div style={style.container} ref={scrollEl} className="overflow-auto scrollbar" onScroll={handleScroll}>
      {!loadingMessage && !hasMessage && <div className='text-center m-4'>---------- No More Message ----------</div>}
      {loadingMessage && <div className='text-center p-2'><Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="md" /></div>}
      {message.map((msg, i) => (
        <div
          key={msg._id}
          ref={(ref: HTMLDivElement) => (messageRef.current[i] = ref)}
        >
          <Message data={msg} />
        </div>
      ))}
    </div>
  );
}
