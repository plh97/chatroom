import { Properties } from "csstype";
import Layout from "@/components/LayoutComponent";

const style: { [key: string]: Properties } = {
  content: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
};

export default function HomePage() {
  useAuth();
  return (
    <Layout>
      <div style={style.content}></div>
    </Layout>
  );
}
