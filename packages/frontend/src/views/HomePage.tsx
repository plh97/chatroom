import { Properties } from "csstype";

const style: { [key: string]: Properties } = {
  content: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
};

export function HomePage() {
  useAuth();
  return (
    <LayoutComponent>
      <div style={style.content}></div>
    </LayoutComponent>
  );
}
