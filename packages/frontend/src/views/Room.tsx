import CSS from "csstype";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Api from "../Api";
import ContentComponent from "../components/ContentComponent";
import ControlComponent from "../components/InputComponent";
import SidebarComponent from "../components/SidebarComponent";
import { ACTION_TYPE } from "../constants";

const style: { [key: string]: CSS.Properties } = {
  home: {
    height: "100%",
    display: "flex",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
};

export default function RoomPage() {
  const dispatch = useDispatch();
  async function getUserInfo() {
    let data = await Api.getMyUserInfo();
    dispatch({
      type: ACTION_TYPE.SAVE_USER_INFO,
      payload: data,
    });
  }
  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <div style={style.home}>
      <SidebarComponent />
      <div style={style.sider}></div>
      <div style={style.body}>
        <ContentComponent />
        <ControlComponent />
      </div>
    </div>
  );
}
