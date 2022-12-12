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
    dispatch(saveUserInfo(userinfo));
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
    await Api.logout();
    dispatch(logout());
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

export const { logout, saveUserInfo } = userSlice.actions;

export default userSlice.reducer;
