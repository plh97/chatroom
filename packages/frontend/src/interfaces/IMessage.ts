import { USER } from "./IUser";

export interface MESSAGE {
  _id: string;
  images: string[];
  text: string;
  user: string;
  createdAt: Date;
  isRead: boolean;
}
