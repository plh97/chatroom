import { UIEvent } from "react";

export const useDebounce = (cb: (event: UIEvent) => void, ms: number = 200) => {
  let timer = -1;
  return (event: UIEvent<HTMLDivElement>) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => cb(event), ms)
  }
}
