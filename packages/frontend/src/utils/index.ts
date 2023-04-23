import { UIEvent } from "react";

export const debounce = (
  cb: (event: UIEvent<HTMLDivElement>, ...args: unknown[]) => void,
  ms = 200
) => {
  let t = 0;
  return (
    event: UIEvent<HTMLDivElement, globalThis.UIEvent>,
    ...args: any[]
  ) => {
    if (!t) {
      cb.apply(this, [event, ...args]);
    }
    clearTimeout(t);
    t = window.setTimeout(() => {
      cb.apply(this, [event, ...args]);
      t = 0;
    }, ms);
  };
};

export const throttle = (
  cb: (event: UIEvent<HTMLDivElement>, ...args: unknown[]) => void,
  ms = 200
) => {
  let t: any;
  return (
    event: UIEvent<HTMLDivElement, globalThis.UIEvent>,
    ...args: any[]
  ) => {
    if (t) return;
    t = window.setTimeout(() => {
      cb.apply(this, [event, ...args]);
      t = 0;
    }, ms);
  };
};
