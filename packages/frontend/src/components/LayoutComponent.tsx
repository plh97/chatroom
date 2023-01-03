import CSS from "csstype";

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

export function LayoutComponent(props: LayoutProps) {
  return (
    <div style={style.home}>
      <SidebarComponent />
      <div style={style.sider}></div>
      <div style={style.body}>{props.children}</div>
    </div>
  );
}
