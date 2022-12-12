import PerfectScrollbar from "perfect-scrollbar";
import { useEffect } from "react";
export default function useScrollbar(className = ".scrollable") {
  useEffect(() => {
    const dom = document.querySelector(className);
    if (dom) {
      const ps = new PerfectScrollbar(dom);
    }
  }, []);
}
