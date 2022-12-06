import { AnyAction } from "redux";
import { ACTION_TYPE } from "../../constants";

const userInitState = {
  room: [],
  friend: [],
  trigger: Math.random(),
};
export default function userReducer(
  state = userInitState,
  action: AnyAction
) {
  switch (action.type) {
    case ACTION_TYPE.SAVE_USER_INFO:
      return action.payload;
    case ACTION_TYPE.LOGOUT:
      return userInitState;
    default:
      return state;
  }
}
