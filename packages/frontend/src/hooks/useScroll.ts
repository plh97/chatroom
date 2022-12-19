import { IState } from "@/store/reducer/room";
import { MutableRefObject, RefObject, useEffect } from "react";
import { useAppSelector } from "./app";

export const useScroll = (scrollEl: RefObject<HTMLDivElement>) => {
  const { scrollToTop, scrollToEnd } = useAppSelector<IState>(
    (state) => state.room
  );
  function handleScrollToTop() {
    if (scrollEl.current?.scrollTop !== undefined) {
      scrollEl.current?.scrollTo({ top: 0 });
    }
  }
  function handleScrollToBottom() {
    scrollEl.current?.scrollTo({ top: 999999999 });
  }
  useEffect(() => {
    handleScrollToTop();
  }, [scrollToTop]);
  useEffect(() => {
    handleScrollToBottom();
  }, [scrollToEnd]);
  return {
    handleScrollToTop,
    handleScrollToBottom,
  };
};
