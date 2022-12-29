import CSS from "csstype";
import { Textarea } from "@chakra-ui/react";
import { KeyboardEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/app";
import { addRoomMessageThunk, scrollToEnd } from "@/store/reducer/room";

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
export default function Input() {
  const { id = "" } = useParams();
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  const [images, setImage] = useState<{ loading: boolean; url: string }[]>([]);
  const myUserInfo = useAppSelector((state) => state.user.data);
  async function handleSubmit(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.metaKey && event.key === "Enter") {
      if (!myUserInfo._id || !text) return;
      await dispatch(
        addRoomMessageThunk({
          text,
          images: images.filter((e) => !e.loading).map((e) => e.url),
          user: myUserInfo._id,
          roomId: id,
        }) as any
      );
      setText("");
      setImage([]);
      dispatch(scrollToEnd());
    }
  }
  return (
    <div style={style.container}>
      <Textarea
        key={id}
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleSubmit}
        style={style.input}
        aria-label="maximum height"
        placeholder="Command + Enter to send message"
      />
    </div>
  );
}
