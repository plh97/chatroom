import Api from "../../Api";
import { ACTION_TYPE } from "../../constants";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";

export function getMyUserInfo() {
  return async (dispatch: Dispatch<AnyAction>) => {
    let data = await Api.getMyUserInfo();
    return {
      type: ACTION_TYPE.SAVE_USER_INFO,
      payload: data,
    };
  };
}
