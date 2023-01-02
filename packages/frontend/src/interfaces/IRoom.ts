import { MESSAGE } from "./IMessage";
import { USER } from "./IUser";

export interface ROOM {
  _id: string;
  name: string;
  image: string;
  member: USER[];
  manager: USER[];
  createdAt: Date;
  updatedAt: Date;
  message: MESSAGE[];
}
