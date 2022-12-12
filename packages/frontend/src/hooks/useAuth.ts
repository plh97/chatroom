import { STATUS } from "@/enum/common";
import { fetchUserInfoThunk } from "@/store/reducer/user";
import { useEffect } from "react";
import { useNavigate, useMatch, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app";
/**
 * auth hooks
 * 1. get user info
 * 2. if already login, relocated to dashboard screen
 * 3. if not yet login, relocated to login screen
 * @export hooks
 */
export function useAuth() {
  const isLogin = useMatch("login");
  const isRegister = useMatch("register");
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const userinfo = useAppSelector((state) => state.user);
  useEffect(() => {
    if (!userinfo?.data?._id) {
      dispatch(fetchUserInfoThunk() as any);
    }
  }, []);
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
