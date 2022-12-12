import CSS from "csstype";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";

const style: { [key: string]: CSS.Properties } = {
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
