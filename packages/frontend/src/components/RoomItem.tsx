import { Properties } from "csstype";
import { useCallback } from "react";

import { ROOM } from "@/interfaces/IRoom";

interface IProps {
  data: ROOM;
  active: boolean;
}

const style: { [key: string]: Properties } = {
  text: {
    color: "#999",
    width: "210px",
  },
};

export function RoomItemComponent(props: IProps) {
  const { data } = props;
  const text = useCallback(() => {
    try {
      return props.data.message[props.data.message.length - 1].text;
    } catch (error) {
      return "-";
    }
  }, [props.data]);
  const containerStyle = props.active ? " bg-white/10" : "";
  return (
    <li key={data._id}>
      <Link
        to={"/room/" + data._id}
        className={
          "flex flex-row overflow-hidden rounded-lg px-2 py-1" + containerStyle
        }
      >
        <Avatar name={data.name} src={data.image} />
        <span className="ml-2 inline-flex flex-col leading-4">
          <span className="font-bold text-base leading-4">{data.name}</span>
          <span
            style={style.text}
            className="whitespace-nowrap break-all overflow-hidden mt-2 text-xs font-normal text-ellipsis"
          >
            {text()}
          </span>
        </span>
      </Link>
    </li>
  );
}
