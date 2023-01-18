import csstype from "csstype";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/app";
import useScroll from "@/hooks/useScroll";
import useWebsocket from "@/hooks/useWebsocket";
import {
  getRoomInfoThunk,
  IState,
  loadMoreMessage,
  loadRoomMoreMessageThunk,
} from "@/store/reducer/room";

const style: { [key: string]: csstype.Properties } = {
  container: {
    flex: 1,
    padding: "0 0.8125rem",
    width: "calc(100vw - 300px)",
  },
};

export function ContentComponent() {
  const messageRef = useRef<HTMLDivElement[]>([]);
  const scrollEl = useRef<HTMLDivElement>(null);
  const {
    data: { message, totalCount },
    loadingMessage,
  } = useAppSelector<IState>((state) => state.room);
  const hasMessage = totalCount > message.length;
  const dispatch = useAppDispatch();
  const { id = "" } = useParams();
  const { getBottomSpace } = useScroll(scrollEl);
  const { connect, disconnect } = useWebsocket(id);
  useEffect(() => {
    if (!id) return;
    dispatch(getRoomInfoThunk(id) as any).then(() => {
      connect();
    });
    return () => {
      disconnect();
    };
  }, [id]);
  const handleScroll = async () => {
    // 如果滚动到了顶部
    console.log(scrollEl.current?.scrollTop);
    if (
      message.length > 0 &&
      scrollEl.current?.scrollTop !== undefined &&
      scrollEl.current?.scrollTop < 20 &&
      !loadingMessage &&
      hasMessage
    ) {
      const { payload } = await dispatch<any>(
        loadRoomMoreMessageThunk({
          page: Math.floor(message.length / 20) + 1,
          pageSize: 20,
          _id: id,
        })
      );
      // 1. 记录当前位置
      // 2. 推入新消息到顶部
      // 3. 滚动滚动条道之前记录位置
      const positionToBottom = getBottomSpace() + 47;
      dispatch(loadMoreMessage(payload));
      setTimeout(() => {
        if (scrollEl.current?.scrollTop !== undefined) {
          console.log("before: ", scrollEl.current.scrollTop);
          scrollEl.current.scrollTop =
            scrollEl.current.scrollHeight - positionToBottom;
          console.log("after: ", scrollEl.current.scrollTop);
        }
      });
    }
  };

  return (
    <div
      style={style.container}
      ref={scrollEl}
      className="overflow-auto scrollbar"
      onScroll={handleScroll}
    >
      {!hasMessage && !loadingMessage && (
        <div className="text-center m-4">---------- END ----------</div>
      )}
      {loadingMessage && (
        <div className="text-center p-2">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="md"
          />
        </div>
      )}
      {message.map((msg, i) => (
        <div
          key={msg._id}
          ref={(ref: HTMLDivElement) => (messageRef.current[i] = ref)}
        >
          <MessageComponent data={msg} />
        </div>
      ))}
    </div>
  );
}
