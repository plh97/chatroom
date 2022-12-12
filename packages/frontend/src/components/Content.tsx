import CSS from "csstype";
import Api from "@/Api";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { fetchRoomInfoThunk, IState } from "@/store/reducer/room";
import { useAppSelector } from "@/hooks/app";
import Message from "./Message";
import useScrollbar from "@/hooks/useScrollbar";

const style: { [key: string]: CSS.Properties } = {
  container: {
    flex: 1,
    padding: "0.8125rem",
    overflow: "scroll",
  },
};

export default function Content() {
  const messageRef = useRef<HTMLDivElement[]>([]);
  const {
    scrollToTop,
    scrollToEnd,
    data: { message },
  } = useAppSelector<IState>((state) => state.room);
  const dispatch = useDispatch();
  const { id = "" } = useParams();
  function handleScrollToTop() {
    const lastNode = messageRef.current[0];
    if (lastNode) {
      lastNode.scrollIntoView();
    }
  }
  function handleScrollToBottom() {
    const lastNode = messageRef.current[messageRef.current.length - 1];
    if (lastNode) {
      lastNode.scrollIntoView();
    }
  }
  useEffect(() => {
    handleScrollToTop();
  }, [scrollToTop]);
  useEffect(() => {
    handleScrollToBottom();
  }, [scrollToEnd]);
  useEffect(() => {
    if (!id) return;
    dispatch(
      fetchRoomInfoThunk({
        page: 1,
        pageSize: 20,
        _id: id,
      }) as any
    );
  }, [id]);
  // useScrollbar(".scrollable");
  return (
    <div style={style.container} className="overflow-scroll">
      {message.map((msg, i) => (
        <div
          key={msg._id}
          ref={(ref: HTMLDivElement) => (messageRef.current[i] = ref)}
        >
          <Message data={msg} />
        </div>
      ))}
      <span className="font-bold">font-bold</span>
    </div>
  );
}
