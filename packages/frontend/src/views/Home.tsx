import CSS from "csstype";
import ControlComponent from "../components/InputComponent";
import SidebarComponent from "../components/SidebarComponent";

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
  return (
    <div style={style.home}>
      <SidebarComponent />
      <div style={style.sider}></div>
      <div style={style.body}>
        <div style={style.content}></div>
        <ControlComponent />
      </div>
    </div>
  );
}

export default HomePage;
