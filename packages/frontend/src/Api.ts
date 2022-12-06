import { createStandaloneToast } from "@chakra-ui/react";
import Axios from "axios";
import { store } from "./store";
import { ACTION_TYPE } from "./constants";
import { useNavigate } from "react-router-dom";

const { toast } = createStandaloneToast();
export const axios = Axios.create({
  baseURL: `//${document.domain}:9002/api`,
  timeout: 10000,
  withCredentials: true,
  // headers: {
  //   "Access-Control-Allow-Origin": "http://127.0.0.1:5173/",
  // },
});

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    console.log("req: suc", config);
    // Do something before request is sent
    // store.dispatch({ type: ACTION_TYPE.FETCH_START })
    return config;
  },
  (error) => {
    console.log("req: error", error.message);
    debugger;
    // Do something with request error
    store.dispatch({
      type: ACTION_TYPE.FETCH_FAIL,
    });
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response) => {
    console.log("res: suc", response);
    const res = response.data;
    if (res.code === 1) {
      res.message &&
        toast({
          description: res.message,
          status: "error",
          position: "top",
          duration: 1000,
        });
    } else if (res.code === 0) {
      res.message &&
        toast({
          description: res.message,
          status: "success",
          position: "top",
          duration: 1000,
        });
    }
    return res.data;
  },
  (error) => {
    const navigate = useNavigate();
    debugger;
    console.log("res: error", error);
    if (error?.response?.status === 401) {
      store.dispatch({
        type: ACTION_TYPE.LOGOUT,
      });
      navigate("/login");
      // return new Error('error');
    }
    store.dispatch({
      type: ACTION_TYPE.FETCH_FAIL,
    });
    return Promise.reject(error);
  }
);

const Api = {
  login: (data: any) =>
    axios({
      url: "/login",
      method: "post",
      data,
    }),
  register: (data: any) =>
    axios({
      url: "/register",
      method: "post",
      data,
    }),
  logout: (data: any) =>
    axios({
      url: "/logout",
      method: "post",
      data,
    }),
  getMyUserInfo: () =>
    axios({
      url: "/userInfo",
      method: "get",
    }),
  setMyUserInfo: (data: any) =>
    axios({
      url: "/userInfo",
      method: "post",
      data,
    }),
  upload: (data: File) =>
    axios({
      url: "/upload",
      method: "post",
      data,
    }),
  getUserImage: (username: string) =>
    axios({
      url: "/userImage",
      method: "get",
      params: {
        username,
      },
    }),
  queryUser: (params: any) =>
    axios({
      url: "/user",
      method: "get",
      params,
    }),
  getRoom: (params: any) =>
    axios({
      url: "/room",
      method: "get",
      params,
    }),
  addRoom: (data: any) =>
    axios({
      url: "/room",
      method: "post",
      data,
    }),
  deleteRoom: (id: string) =>
    axios({
      url: "/room/" + id,
      method: "delete",
    }),
  editRoom: () =>
    axios({
      url: "/room",
      method: "patch",
    }),
  sendMessage: (data: any) =>
    axios({
      url: "/room/message",
      method: "post",
      data,
    }),
  deleteMessage: (params: any) =>
    axios({
      url: "/room/message",
      method: "delete",
      params,
    }),
  addFriend: (data: any) =>
    axios({
      url: "/friend",
      method: "post",
      data,
    }),
  deleteFriend: (params: any) =>
    axios({
      url: "/friend",
      method: "delete",
      params,
    }),
};

export default Api;
