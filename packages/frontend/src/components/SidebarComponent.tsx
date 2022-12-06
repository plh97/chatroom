import CSS from "csstype";
import { useEffect, useState } from "react";
import useRequest from "../hooks/useRequest";

const style: { [key: string]: CSS.Properties } = {
  sider: {
    width: "300px",
    backgroundColor: "#212121",
  },
};

interface Room {
  id: string;
  name: string;
}

export default function () {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { loading, run } = useRequest();
  useEffect(() => {
    run({ url: "/room", method: "get" }).then((res) => {
      console.log(res);
    });
  }, []);
  return (
    <div style={style.sider}>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>{room.name}</li>
        ))}
      </ul>
    </div>
  );
}
