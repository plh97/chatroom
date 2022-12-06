import CSS from "csstype";
import { Textarea } from "@chakra-ui/react";
import { KeyboardEvent, useState } from "react";
import useRequest from "../hooks/useRequest";
import Api from "../Api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { USER_TYPE } from "../store/reducer/user";
import { useParams } from "react-router-dom";
import { ACTION_TYPE } from "../constants";

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
  const { id } = useParams();
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [images, setImage] = useState<{ loading: boolean; url: string }[]>([]);
  const myUserInfo = useSelector<RootState, USER_TYPE>((state) => state.user);
  async function handleSubmit(event: KeyboardEvent<HTMLTextAreaElement>) {
    console.log(event);
    if (event.key === "Enter") {
      const msg = await Api.sendMessage({
        text,
        images: images.filter((e) => !e.loading).map((e) => e.url),
        user: myUserInfo._id,
        roomId: id,
      });
      dispatch({
        type: ACTION_TYPE.ADD_MESSAGE,
        payload: { message: [msg] },
      });
      setText("");
      setImage([]);
    }
  }
  return (
    <div style={style.container}>
      <Textarea
        value={text}
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
