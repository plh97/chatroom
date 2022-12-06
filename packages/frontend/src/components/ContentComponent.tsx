import CSS from "csstype";
import Api from "../Api";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/index";
import { MESSAGE_TYPE } from "../store/reducer/message";
import { useParams } from "react-router-dom";
import { ACTION_TYPE } from "../constants";
import { useEffect } from "react";

const style: { [key: string]: CSS.Properties } = {
  container: {
    flex: 1,
    overflow: "scroll",
  },
};

export default function ContentComponent() {
  const { message, totalCount } = useSelector<RootState, MESSAGE_TYPE>(
    (state) => state.message
  );
  const dispatch = useDispatch();
  const { id } = useParams();
  async function getRoomInfo() {
    let data = await Api.getRoom({
      page: 1,
      pageSize: 20,
      _id: id,
    });
    dispatch({
      type: ACTION_TYPE.ADD_MESSAGE,
      payload: data,
    });
  }
  useEffect(() => {
    getRoomInfo();
  }, [id]);
  return (
    <div key={totalCount} style={style.container}>
      {message.map((msg) => {
        return <li key={msg._id}>{msg.text}</li>;
      })}
    </div>
  );
}
