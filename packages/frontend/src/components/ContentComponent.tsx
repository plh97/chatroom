import csstype from "csstype";
import { useEffect, useRef } from "react";
import { getRoomInfoThunk, loadRoomMoreMessageThunk, IState, loadMoreMessage } from "@/store/reducer/room";
import { useAppDispatch, useAppSelector } from "@/hooks/app";
import Message from "./MessageComponent";
import { Spinner } from "@chakra-ui/react";
import useScroll from "@/hooks/useScroll";
import useWebsocket from "@/hooks/useWebsocket";

const style: { [key: string]: csstype.Properties } = {
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
  const { getBottomSpace } = useScroll(scrollEl);
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
    console.log(scrollEl.current?.scrollTop);
    if (
      message.length > 0 &&
      scrollEl.current?.scrollTop !== undefined &&
      scrollEl.current?.scrollTop < 10 &&
      !loadingMessage && hasMessage
    ) {
      const { payload } = await dispatch<any>(
        loadRoomMoreMessageThunk({
          page: Math.floor(message.length / 20) + 1,
          pageSize: 20,
          _id: id,
        })
      )
      // 1. 记录当前位置
      // 2. 推入新消息到顶部
      // 3. 滚动滚动条道之前记录位置
      // const positionToBottom = getBottomSpace();
      const targetElement = scrollEl.current.children[0]
      dispatch(loadMoreMessage(payload));
      (targetElement as HTMLDivElement)?.scrollIntoView();
      // if (scrollEl.current?.scrollTop !== undefined) {
      //   scrollEl.current.scrollTop = scrollEl.current.scrollHeight - positionToBottom;
      // }
    }
  };

  return (
    <div style={style.container} ref={scrollEl} className="overflow-auto scrollbar" onScroll={handleScroll}>
      {!hasMessage && <div className='text-center m-4'>---------- END ----------</div>}
      {/* {hasMessage && <div className='text-center p-2'><Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="md" /></div>} */}
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
