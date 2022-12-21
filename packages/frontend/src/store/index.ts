import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import thunk from "redux-thunk";
import userReducer from "./reducer/user";
import roomReducer from "./reducer/room";

export const store = configureStore({
  reducer: {
    user: userReducer,
    room: roomReducer,
  },
  middleware: [
    // logger,
    thunk,
  ],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
