import { AnyAction } from "redux";
import { ACTION_TYPE } from "../../constants";
import { USER } from "../../interfaces/IUser";

const userInitState: Partial<USER> = {
  _id: "",
  room: [],
  friend: [],
  // trigger: Math.random(),
};
export function userReducer(state = userInitState, action: AnyAction) {
  switch (action.type) {
    case ACTION_TYPE.SAVE_USER_INFO:
      return action.payload;
    case ACTION_TYPE.LOGOUT:
      return userInitState;
    default:
      return state;
  }
}

export type USER_TYPE = Partial<USER>;
