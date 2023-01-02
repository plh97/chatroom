import { ROOM } from "./IRoom";

export interface USER {
  _id: string;
  image: string;
  username: string;
  password: string;
  bio: string;
  qq: string;
  wechat: string;
  github: string;
  permission: string;
  room: ROOM[];
  friend: USER[];
}
