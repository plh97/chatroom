import { Dispatch } from "@reduxjs/toolkit";
import { KeyboardEvent } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/hooks/app";
import { addRoomMessageThunk, scrollToEnd } from "@/store/reducer/room";

export function ControlComponent() {
  const { id = "" } = useParams();
  const dispatch = useDispatch<Dispatch<any>>();
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
        })
      );
      setText("");
      setImage([]);
      dispatch(scrollToEnd());
    }
  }
  return (
    <div className="box-border flex flex-col flex-0 basis-20 pt-0 pb-5 px-3">
      <Textarea
        key={id}
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleSubmit}
        className="flex-1"
        aria-label="maximum height"
        placeholder="Command + Enter to send message"
      />
    </div>
  );
}
