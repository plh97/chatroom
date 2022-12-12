import { USER } from "./IUser";

export interface MESSAGE {
  _id: string;
  images: string[];
  text: string;
  user: USER;
  createdAt: Date;
  isRead: boolean;
}

export interface MESSAGE_RESPONSE {
  message: MESSAGE[];
  totalCount: number;
}

export interface MESSAGE_REQUEST {
  page: number;
  pageSize: number;
  _id: string;
}

export interface ADD_MESSAGE_REQUEST {

  text: string,
  images: string[],
  user: string,
  roomId: string,
}
