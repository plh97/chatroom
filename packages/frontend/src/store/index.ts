import thunk from "redux-thunk";
import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import messageReducer from "./reducer/message";
import { userReducer } from "./reducer/user";
// ...

export const store = configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer,
  },
  middleware: [logger, thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
