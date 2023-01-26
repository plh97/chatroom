import { UIEvent } from "react";

export const debounce = (
  cb: (event: UIEvent<HTMLDivElement>) => void,
  ms = 200
) => {
  let t: NodeJS.Timeout;
  return (event: UIEvent<HTMLDivElement, globalThis.UIEvent>) => {
    clearTimeout(t);
    t = setTimeout(() => {
      cb(event);
    }, ms);
  };
};
