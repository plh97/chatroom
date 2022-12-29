import CSS from "csstype";
import { Button } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/index";
import { Link } from "react-router-dom";
import { USER } from "@/interfaces/IUser";
import { logoutThunk } from "@/store/reducer/user";
import { addRoomThunk } from "@/store/reducer/room";

const style: { [key: string]: CSS.Properties } = {
  sider: {
    width: "300px",
    backgroundColor: "#212121",
  },
  control: {
    display: "flex",
    height: "50px",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default function Sidebar() {
  const myUserInfo = useSelector<RootState, Partial<USER>>((state) => {
    return state.user.data;
  });
  const dispatch = useDispatch<AppDispatch>();
  function handleAddRoom() {
    dispatch(
      addRoomThunk({
        name: "roomname",
        member: [myUserInfo._id ?? ''],
      }) as any
    );
  }
  function handleLogout() {
    dispatch(logoutThunk() as any);
  }
  return (
    <div style={style.sider}>
      <div style={style.control}>
        <Button colorScheme="grey" variant="outline" onClick={() => handleAddRoom()}>
          Add Room
        </Button>
      </div>
      <ul>
        {myUserInfo.room?.map((room) => (
          <li key={room._id}>
            <Link to={"/room/" + room._id}>{room.name}</Link>
          </li>
        ))}
      </ul>
      <Button colorScheme="grey" variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
