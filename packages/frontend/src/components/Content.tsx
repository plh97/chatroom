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
import { throttle } from "@/utils";
import { addMessage, scrollToEnd } from "@/store/reducer/room";
import { updateUserRoomMessage } from "@/store/reducer/user";
import { EMPTY_FN } from "@/constants";

export function ContentComponent() {
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
  const [distanceToBottom, setDistanceToBottom] = useState<number | null>(null);
  useEffect(() => {
    if (!id) return;
    let unsubFN = EMPTY_FN;
    // 清空旧的信息
    dispatch(initialMessage({ message: [], totalCount: 0 }));
    dispatch(getRoomInfoThunk(id) as any).then(() => {
      unsubFN = subscribe(
        {
          channel: `room:${id}`,
        },
        (msg) => {
          dispatch(addMessage([msg]));
          console.log(id);
          dispatch(updateUserRoomMessage({ roomId: id, msg }));
          dispatch(scrollToEnd());
        }
      );
    });
    return () => {
      unsubFN();
    };
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
      const distanceToTop = getTopSpace();
      dispatch(loadMoreMessage(payload));
      if (Number(distanceToTop) === 0) {
        setDistanceToBottom(getBottomSpace());
      }
    }
  };

  useLayoutEffect(() => {
    if (
      scrollEl.current?.scrollTop !== undefined &&
      distanceToBottom !== null
    ) {
      scrollEl.current.scrollTop =
        scrollEl.current.scrollHeight - distanceToBottom;
      setDistanceToBottom(null);
    }
  }, [distanceToBottom]);

  const TipComponent = () => {
    return (
      <>
        {!hasMessage && !loadingMessage && (
          <div className="text-center m-4">---------- END ----------</div>
        )}
        {loadingMessage && (
          <div className="text-center mt-2 mb-2 right-0 top-0 absolute w-full">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="md"
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div
      className="overflow-y-auto flex-1 relative px-3.5 py-0"
      ref={scrollEl}
      onScroll={throttle(handleScroll)}
    >
      <TipComponent />
      {message.map((msg) => (
        <MessageComponent key={msg._id} data={msg} />
      ))}
    </div>
  );
}
