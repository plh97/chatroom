import csstype from "csstype";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/app";
import useScroll from "@/hooks/useScroll";
import useWebsocket from "@/hooks/useWebsocket";
import {
  getRoomInfoThunk,
  initialMessage,
  IState,
  loadMoreMessage,
  loadRoomMoreMessageThunk,
} from "@/store/reducer/room";
import { debounce } from "@/utils";

const style: { [key: string]: csstype.Properties } = {
  container: {
    flex: 1,
    padding: "0 0.8125rem",
    width: "calc(100vw - 300px)",
    position: "relative",
  },
  loadmore: {
    position: "absolute",
    top: 0,
    width: "100%",
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
  const { getBottomSpace, getTopSpace } = useScroll(scrollEl);
  const { connect, disconnect } = useWebsocket(id);
  const [positionToBottom, setPositionToBottom] = useState<number | null>(null);
  useEffect(() => {
    if (!id) return;
    // 清空旧的信息
    dispatch(initialMessage({ message: [], totalCount: 0 }));
    dispatch(getRoomInfoThunk(id) as any).then(() => {
      connect();
    });
    return () => {
      disconnect();
    };
  }, [id]);
  const handleScroll = async () => {
    // 如果滚动到了顶部
    if (
      message.length > 0 &&
      scrollEl.current?.scrollTop === 0 &&
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
      const positionToTop = getTopSpace();
      dispatch(loadMoreMessage(payload));
      if (Number(positionToTop) === 0) {
        setPositionToBottom(getBottomSpace());
      }
    }
  };

  useLayoutEffect(() => {
    if (
      scrollEl.current?.scrollTop !== undefined &&
      positionToBottom !== null
    ) {
      scrollEl.current.scrollTop =
        scrollEl.current.scrollHeight - positionToBottom;
      setPositionToBottom(null);
    }
  }, [positionToBottom]);

  return (
    <div
      style={style.container}
      ref={scrollEl}
      className="overflow-auto scrollbar"
      onScroll={debounce(handleScroll)}
    >
      {!hasMessage && !loadingMessage && (
        <div className="text-center m-4">---------- END ----------</div>
      )}
      {loadingMessage && (
        <div className="text-center p-2" style={style.loadmore}>
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
