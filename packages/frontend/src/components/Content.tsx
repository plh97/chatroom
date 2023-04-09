import csstype from "csstype";
import { Fragment, useEffect, useRef } from "react";
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
import { addMessage, scrollToEnd } from "@/store/reducer/room";
import { updateUserRoomMessage } from "@/store/reducer/user";

const style: { [key: string]: csstype.Properties } = {
  container: {
    overflow: "overlay",
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
  const { subscribe } = useWebsocket();
  const [positionToBottom, setPositionToBottom] = useState<number | null>(null);
  useEffect(() => {
    if (!id) return;
    // 清空旧的信息
    dispatch(initialMessage({ message: [], totalCount: 0 }));
    dispatch(getRoomInfoThunk(id) as any).then(() => {
      subscribe(
        {
          id,
        },
        (msg) => {
          dispatch(addMessage([msg]));
          dispatch(updateUserRoomMessage({ roomId: id, msg }));
          dispatch(scrollToEnd());
        }
      );
    });
  }, [id]);
  const handleScroll = async () => {
    // 如果滚动到了顶部
    if (
      message.length > 0 &&
      Number(scrollEl.current?.scrollTop) < 300 &&
      !loadingMessage &&
      hasMessage
    ) {
      const { payload } = await dispatch<any>(
        loadRoomMoreMessageThunk({
          start: message?.length ?? 0,
          pageSize: 20,
          _id: id,
        })
      );
      const positionToTop = getTopSpace();
      dispatch(loadMoreMessage(payload));
      if (Number(positionToTop) < 300) {
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
      onScroll={debounce(handleScroll)}
    >
      {!hasMessage && !loadingMessage && (
        <div className="text-center m-4">---------- END ----------</div>
      )}
      {loadingMessage && (
        <div className="text-center mt-2 mb-2 right-0" style={style.loadmore}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="md"
          />
        </div>
      )}
      {message.map((msg) => (
        <Fragment key={msg._id}>
          <MessageComponent data={msg} />
        </Fragment>
      ))}
    </div>
  );
}
