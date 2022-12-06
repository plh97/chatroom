import CSS from "csstype";
import { Textarea } from '@chakra-ui/react'
import { KeyboardEvent, useState } from "react";
import useRequest from "../hooks/useRequest";

const style: { [key: string]: CSS.Properties } = {
  container: {
    flex: "0 0 84px",
    padding: "0 13px 20px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    flex: 1,
  },
};
export default function ControlComponent() {
  const [text, setText] = useState("");
  const { run, loading } = useRequest();
  function handleSubmit(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter") {
      console.log(text, event.key);
      run({ url: "/room/message", method: "post", data: {} });
    }
  }
  return (
    <div style={style.container}>
      <Textarea
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleSubmit}
        style={style.input}
        aria-label="maximum height"
        placeholder="Command + Enter to send message"
        // placeholder="Message"
      />
    </div>
  );
}
