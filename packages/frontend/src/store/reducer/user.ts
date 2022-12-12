import { USER } from "@/interfaces/IUser";
import { AnyAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "@/Api";
import { STATUS } from "@/enum/common";

export interface IState {
  error: string | null;
  data: Partial<USER>;
  auth: Boolean | null;
}

const initialState: IState = {
  error: null,
  auth: null,
  data: {
    _id: "",
    room: [],
    friend: [],
  },
};

export const fetchUserInfoThunk = createAsyncThunk(
  `getMyUserInfo`,
  async (_, { dispatch }) => {
    const userinfo = await Api.getMyUserInfo();
    dispatch({
      type: "user/saveUserInfo",
      payload: userinfo,
    });
    return userinfo;
  }
);

export const loginThunk = createAsyncThunk<
  void,
  { username: string; password: string },
  any
>(`login`, async (data, { dispatch }) => {
  const isSuc = await Api.login(data);
  if (!isSuc) return;
  dispatch(fetchUserInfoThunk());
});
export const logoutThunk = createAsyncThunk(
  `logout`,
  async (_, { dispatch }) => {
    const userinfo = await Api.logout();
    dispatch({
      type: "user/logout",
    });
    return userinfo;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUserInfo(state, action) {
      Object.assign(state, {
        auth: true,
        data: {
          ...state.data,
          ...action.payload,
        },
      });
    },
    logout(state) {
      Object.assign(state, {
        auth: false,
        status: STATUS.FAILED,
      });
    },
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
