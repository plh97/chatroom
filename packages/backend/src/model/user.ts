import { Schema, Model, model, Types } from "mongoose";
import { personIcon } from "@/config";
import { IRoom } from "@/model/room";

export interface IUser {
  _id: Types.ObjectId;
  image: string[];
  username: string;
  password: string;
  bio: string;
  qq: string;
  wechat: string;
  github: string;
  permission: string;
  room: IRoom[];
  friend: IUser[];
}

const schema = new Schema<IUser>({
  // image: {type: String, default: 'https://avatars3.githubusercontent.com/u/14355994?s=460&u=1f1d3a174d2e0f79bcd5379a4d832fa9d0777ff3&v=4'},
  image: { type: String, default: personIcon },
  username: String,
  password: { type: String, required: true, select: false },
  bio: String,
  qq: String,
  wechat: String,
  github: String,
  permission: String,
  room: [{ type: Schema.Types.ObjectId, ref: "Room" }],
  friend: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

class ModelClass extends Model {
  static saveOne(body: IUser) {
    return this.create(body);
  }
}

schema.loadClass(ModelClass);

export default model<IUser>("User", schema);
