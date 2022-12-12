import CSS from "csstype";
import Api from "@/Api";
import { Button, flexbox } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/index";
import { Link } from "react-router-dom";
import { ACTION_TYPE } from "../constants";
import { USER } from "@/interfaces/IUser";
import { logout, logoutThunk } from "@/store/reducer/user";

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

export default function Sidebar () {
  const myUserInfo = useSelector<RootState, Partial<USER>>((state) => {
    return state.user.data;
  });
  const dispatch = useDispatch<AppDispatch>();
  async function handleAddRoom() {
    await Api.addRoom({
      name: "roomname",
      member: [myUserInfo._id],
    });
    let data = await Api.getMyUserInfo();
    dispatch({
      type: ACTION_TYPE.SAVE_USER_INFO,
      payload: data,
    });
  }
  function handleLogout() {
    dispatch(logoutThunk() as any);
  }
  return (
    <div style={style.sider}>
      <div style={style.control}>
        <Button colorScheme="grey" variant="outline" onClick={handleAddRoom}>
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
