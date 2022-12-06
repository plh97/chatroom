import { getMyUserInfo } from "../store/action/user";
import CSS from "csstype";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Api from "../Api";
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

function HomePage() {
  const dispatch = useDispatch();
  useEffect(() => {
    async () => {
      dispatch(getMyUserInfo());
    };
  }, []);
  return (
    <div style={style.home}>
      <SidebarComponent />
      <div style={style.sider}></div>
      <div style={style.body}>
        <div style={style.content}></div>
      </div>
    </div>
  );
}

export default HomePage;
