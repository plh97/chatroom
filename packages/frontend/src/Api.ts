import { AxiosRequestConfig } from "axios";
import {
  ADD_MESSAGE_REQUEST,
  MESSAGE,
  MESSAGE_RESPONSE,
} from "@/interfaces/IMessage";
import { USER } from "@/interfaces/IUser";

const { toast } = createStandaloneToast();
export const axios = Axios.create({
  baseURL: `//api.plhh.xyz/api`,
  timeout: 10000,
  withCredentials: true,
});

axios.interceptors.response.use(
  (response) => {
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
    return res;
  },
  async (error) => {
    if (error?.response?.status === 401) {
      // to fix the cycle import
      const { store } = await import("@/store");
      const { logout } = await import("@/store/reducer/user");
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export async function request<RESPONSE>(
  config: AxiosRequestConfig
): Promise<RESPONSE> {
  const res = await axios.request<RESPONSE>(config);
  return res.data;
}

interface ILoginRequestParamters {
  username: string;
  password: string;
}

const Api = {
  login: (data: ILoginRequestParamters) =>
    request({
      url: "/login",
      method: "post",
      data,
    }),
  register: (data: ILoginRequestParamters) =>
    request({
      url: "/register",
      method: "post",
      data,
    }),
  logout: () =>
    request({
      url: "/logout",
      method: "post",
    }),
  getMyUserInfo: () =>
    request<USER>({
      url: "/userInfo",
      method: "get",
    }),
  setMyUserInfo: () =>
    request({
      url: "/userInfo",
      method: "post",
    }),
  upload: (data: File) =>
    request({
      url: "/upload",
      method: "post",
      data,
    }),
  getUserImage: (username: string) =>
    request<string>({
      url: "/userImage",
      method: "get",
      params: {
        username,
      },
    }),
  queryUser: () =>
    request({
      url: "/user",
      method: "get",
    }),
  getRoom: (params: { page: number; pageSize: number; _id: string }) =>
    request<MESSAGE_RESPONSE>({
      url: "/room",
      method: "get",
      params,
    }),
  addRoom: (data: { name: "roomname"; member: string[] }) =>
    request({
      url: "/room",
      method: "post",
      data,
    }),
  deleteRoom: (id: string) =>
    request({
      url: "/room/" + id,
      method: "delete",
    }),
  editRoom: () =>
    request({
      url: "/room",
      method: "patch",
    }),
  sendMessage: (data: ADD_MESSAGE_REQUEST) =>
    request<MESSAGE>({
      url: "/room/message",
      method: "post",
      data,
    }),
  deleteMessage: () =>
    request({
      url: "/room/message",
      method: "delete",
    }),
  addFriend: () =>
    request({
      url: "/friend",
      method: "post",
    }),
  deleteFriend: () =>
    request({
      url: "/friend",
      method: "delete",
    }),
};

export default Api;
