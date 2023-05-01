import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import Api from "@/Api";
import {
  ADD_MESSAGE_REQUEST,
  MESSAGE,
  MESSAGE_REQUEST,
  MESSAGE_RESPONSE,
} from "@/interfaces/IMessage";

import { fetchUserInfoThunk } from "./user";
import { ROOM } from "@/interfaces/IRoom";

export interface IState {
  id: string;
  scrollToEnd?: number;
  scrollToTop?: number;
  error: string | null;
  data: MESSAGE_RESPONSE;
  loadingMessage: boolean;
}

const initialState: IState = {
  id: "", // room id
  scrollToEnd: undefined,
  scrollToTop: undefined,
  loadingMessage: false,
  error: null,
  data: {
    message: [],
    totalCount: 0,
  },
};

// 加载房间基本信息
export const getRoomInfoThunk = createAsyncThunk<void, string>(
  `fetchRoomInfo`,
  async (id, { dispatch }) => {
    // 修改当前面room id
    dispatch(changeRoomId(id));
    // 加载中
    dispatch(changeLoading(true));
    // 获取当前房间基本信息
    const res = await Api.getRoom({
      pageSize: 20,
      _id: id,
    });
    // 加载结束
    dispatch(changeLoading(false));
    // 将当前房间基本信息存到store里面
    dispatch(initialMessage(res));
    // div元素撑开后，滚动到底部
    dispatch(scrollToEnd());
  }
);
// 加载更多消息
export const loadRoomMoreMessageThunk = createAsyncThunk<
  MESSAGE[],
  MESSAGE_REQUEST
>(`loadRoomMoreMessageThunk`, async (data, { dispatch }) => {
  dispatch(changeLoading(true));
  const res = await Api.getRoom(data);
  dispatch(changeLoading(false));
  return res.message;
});

// 发送一条新消息
export const addRoomMessageThunk = createAsyncThunk<void, ADD_MESSAGE_REQUEST>(
  `addRoomMessage`,
  async (data) => {
    await Api.sendMessage(data);
  }
);

export const addRoomThunk = createAsyncThunk<
  ROOM,
  { member: string[]; name: string }
>(`register`, async (data, { dispatch }) => {
  const res = await Api.addRoom(data);
  dispatch(fetchUserInfoThunk());
  console.log(res);
  return res;
});

export const roomSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    changeLoading(state, action: PayloadAction<boolean>) {
      state.loadingMessage = action.payload;
    },
    scrollToEnd(state) {
      state.scrollToEnd = Math.random();
    },
    scrollToTop(state) {
      state.scrollToTop = Math.random();
    },
    loadMoreMessage(state, action: PayloadAction<MESSAGE[]>) {
      state.data.message = [...action.payload, ...state.data.message];
    },
    changeRoomId(state, action) {
      state.id = action.payload;
    },
    addMessage(state, action: PayloadAction<MESSAGE[]>) {
      state.data.message.push(action.payload[0]);
    },
    initialMessage(
      state,
      action: PayloadAction<{ message: MESSAGE[]; totalCount: number }>
    ) {
      state.data = action.payload;
    },
  },
});

export const {
  scrollToTop,
  scrollToEnd,
  addMessage,
  loadMoreMessage,
  initialMessage,
  changeLoading,
  changeRoomId,
} = roomSlice.actions;

export default roomSlice.reducer;
