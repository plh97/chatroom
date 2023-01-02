import CSS from "csstype";
import { Button } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/index";
import { USER } from "@/interfaces/IUser";
import { logoutThunk } from "@/store/reducer/user";
import { addRoomThunk } from "@/store/reducer/room";
import { RoomItem } from "./RoomItemComponent";

const style: { [key: string]: CSS.Properties } = {
  sider: {
    width: "300px",
    backgroundColor: "#212121",
    display: "flex",
    flexDirection: 'column',
  },
  control: {
    display: "flex",
    height: "50px",
    alignItems: "center",
    justifyContent: "center",
  },
  roomList: {
    flex: 1,
    overflowY: 'auto',
    padding: "0 0.5rem",
  }
};

export default function Sidebar() {
  const myUserInfo = useSelector<RootState, Partial<USER>>((state) => {
    return state.user.data;
  });
  const { id = "" } = useParams();
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
      <ul style={style.roomList}>
        {myUserInfo.room?.map((room) => <RoomItem active={room._id == id} key={room._id} data={room} />)}
      </ul>
      <div style={style.control}>
        <Button colorScheme="grey" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
