import {
  ADD_MESSAGE_REQUEST,
  MESSAGE,
  MESSAGE_REQUEST,
  MESSAGE_RESPONSE,
} from "@/interfaces/IMessage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import Api from "@/Api";

export interface IState {
  scrollToEnd: null | number;
  scrollToTop: null | number;
  error: string | null;
  data: MESSAGE_RESPONSE;
}

const initialState: IState = {
  scrollToEnd: null,
  scrollToTop: null,
  error: null,
  data: {
    message: [],
    totalCount: 0,
  },
};

export const fetchRoomInfoThunk = createAsyncThunk<void, MESSAGE_REQUEST>(
  `fetchRoomInfo`,
  async (data, { dispatch }) => {
    let res = await Api.getRoom(data);
    dispatch(initialMessage(res));
    dispatch(scrollToEnd());
  }
);

export const addRoomMessageThunk = createAsyncThunk<void, ADD_MESSAGE_REQUEST>(
  `addRoomMessage`,
  async (data, { dispatch }) => {
    let newMessage = await Api.sendMessage(data);
    dispatch(addMessage([newMessage]));
  }
);

export const roomSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    scrollToEnd(state) {
      state.scrollToEnd = Math.random();
    },
    scrollToTop(state) {
      state.scrollToTop = Math.random();
    },
    addMessage(state, action: PayloadAction<MESSAGE[]>) {
      state.data.message.push(action.payload[0]);
    },
    initialMessage(
      state,
      action: PayloadAction<{ message: MESSAGE[]; totalCount: number }>
    ) {
      state.data.message = action.payload.message;
    },
  },
});

export const { scrollToTop, scrollToEnd, addMessage, initialMessage } =
  roomSlice.actions;

export default roomSlice.reducer;
