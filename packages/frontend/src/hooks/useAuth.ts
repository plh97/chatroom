import { useEffect } from "react";
import { useMatch } from "react-router-dom";

import {
  fetchUserInfoThunk,
  updateUserRoomMessage,
} from "@/store/reducer/user";

import { useAppDispatch, useAppSelector } from "./app";
/**
 * auth hooks
 * 1. get user info
 * 2. if already login, relocated to dashboard screen
 * 3. if not yet login, relocated to login screen
 * @export hooks
 */
export default function useAuth() {
  const isLogin = useMatch("login");
  const isRegister = useMatch("register");
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const userinfo = useAppSelector((state) => state.user);
  const { subscribe } = useWebsocket();
  useEffect(() => {
    if (userinfo?.data?._id) {
      console.log(userinfo?.data);
      userinfo?.data?.room?.forEach((room) => {
        subscribe(
          {
            channel: `room:${room._id}`,
          },
          (msg) => {
            dispatch(updateUserRoomMessage({ roomId: room._id, msg }));
          }
        );
      });
    } else {
      dispatch(fetchUserInfoThunk() as any);
    }
  }, [userinfo?.data?._id]);
  useEffect(() => {
    if (isLogin || isRegister) {
      if (userinfo.auth === true) {
        navigation("/");
      }
    } else {
      if (userinfo.auth === false) {
        navigation("/login");
      }
    }
  }, [userinfo.auth]);
}
