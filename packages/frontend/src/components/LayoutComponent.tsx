import CSS from "csstype";
import SidebarComponent from "@/components/SidebarComponent";

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

interface LayoutProps {
  children?: React.ReactNode; // 👈️ for demo purposes
}

export default function Layout(props: LayoutProps) {
  return (
    <div style={style.home}>
      <SidebarComponent />
      <div style={style.sider}></div>
      <div style={style.body}>{props.children}</div>
    </div>
  );
}
