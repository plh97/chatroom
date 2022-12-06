import { MESSAGE } from "../../interfaces/IMessage";
import { ACTION_TYPE } from "../../constants";
import { AnyAction } from "@reduxjs/toolkit";

export interface MESSAGE_TYPE {
  message: MESSAGE[];
  totalCount: number;
  trigger: number;
}

const initialState: MESSAGE_TYPE = {
  message: [],
  totalCount: 0,
  trigger: Math.random(),
};

export default function messageReducer(
  state = initialState,
  action: AnyAction
) {
  switch (action.type) {
    case ACTION_TYPE.ADD_MESSAGE:
      return {
        ...state,
        ...action.payload,
        message: [
          ...state.message,
          ...action.payload.message,
        ]
      };
    case ACTION_TYPE.INITIAL_MESSAGE:
      debugger;

      return initialState;
    default:
      return state;
  }
}
