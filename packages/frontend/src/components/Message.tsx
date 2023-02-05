import CSS from "csstype";
import { MESSAGE } from "@/interfaces/IMessage";

const style: { [key: string]: CSS.Properties } = {
  container: {
    position: "relative",
    marginBottom: "0.5rem",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  content: {
    margin: "0 10px",
    padding: "10px",
    maxWidth: "60%",
    borderRadius: "10px",
    background: "#212121",
    boxShadow: "0 0px 5px 2px rgba(0, 21, 20, 0.1)",
    whiteSpace: "pre-wrap",
  },
};

interface IProps {
  data: MESSAGE;
}
/**
 * Pure Componennt
 *
 * @export
 * @param {IProps} { data }
 * @return {JSX.Element}
 */
export function MessageComponent({ data }: IProps): JSX.Element {
  return (
    <div style={style.container}>
      <Avatar name={data.user?.username} src={data.user?.image} />
      <span style={style.content}>
        <div className="img">
          {data.images.map((img) => (
            <img key={img} src={img} alt="img" />
          ))}
        </div>
        <span className="text">{data.text}</span>
      </span>
    </div>
  );
}
