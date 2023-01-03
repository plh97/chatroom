import { Dispatch } from "@reduxjs/toolkit";
import CSS from "csstype";
import { useDispatch, useSelector } from "react-redux";
import { USER } from "@/interfaces/IUser";
import { RootState } from "@/store/index";
import { addRoomThunk } from "@/store/reducer/room";
import { logoutThunk } from "@/store/reducer/user";

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

export function SidebarComponent() {
  const myUserInfo = useSelector<RootState, Partial<USER>>((state) => {
    return state.user.data;
  });
  const { id = "" } = useParams();
  const dispatch = useDispatch<Dispatch<any>>();
  function handleAddRoom() {
    dispatch(
      addRoomThunk({
        name: "roomname",
        member: [myUserInfo._id ?? ''],
      })
    );
  }
  function handleLogout() {
    dispatch(logoutThunk());
  }
  return (
    <div style={style.sider}>
      <div style={style.control}>
        <Button colorScheme="grey" variant="outline" onClick={() => handleAddRoom()}>
          Add Room
        </Button>
      </div>
      <ul style={style.roomList}>
        {myUserInfo.room?.map((room) => <RoomItemComponent active={room._id == id} key={room._id} data={room} />)}
      </ul>
      <div style={style.control}>
        <Button colorScheme="grey" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
