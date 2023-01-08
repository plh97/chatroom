import { Context } from "koa";
import * as jwt from "jsonwebtoken";
import { privateKey } from "@/config";
import RoomModel from "@/model/room";
import UserModel, { IUser } from "@/model/user";
import { Types } from "mongoose";

/**
 * get user info through cookie
 * @param {*} ctx
 */
export async function GetUserInfo(ctx: Context) {
  const cookie = ctx.cookies.get("token") ?? "";
  const _id = jwt.verify(cookie, privateKey) as string;
  const userinfo = await UserModel.findOne({ _id })
    .populate("friend")
    .populate("room")
    .populate({ path: "room", options: { sort: { updatedAt: -1 } } });
  if (userinfo) {
    ctx.body = {
      code: 0,
      data: userinfo,
    };
  } else {
    ctx.body = {
      code: 0,
    };
  }
}
/**
 * 只能设置自己的信息
 *
 * @param {*} ctx
 */
export async function SetUserInfo(ctx: Context) {
  const { image } = ctx.request.body;
  const cookie = ctx.cookies.get("token") ?? "";
  const _id = jwt.verify(cookie, privateKey) as string;
  await UserModel.updateOne({ _id }, { $set: { image } });
  const userinfo = await UserModel.findOne({ _id })
    .populate("friend")
    .populate("room");
  if (userinfo) {
    ctx.body = {
      code: 0,
      data: userinfo,
    };
  } else {
    ctx.body = {
      code: 0,
    };
  }
}

export async function GetUserImage(ctx: Context) {
  const username = (ctx.request.query.username as string) ?? "";
  if (username) {
    const userinfo: IUser | null = await UserModel.findOne({ username });
    if (userinfo) {
      userinfo.password = "";
      ctx.body = {
        code: 0,
        data: userinfo.image,
      };
    } else {
      ctx.body = {
        code: 1,
        data: null,
      };
    }
  } else {
    ctx.body = {
      code: 0,
      data: null,
    };
  }
}

export async function QueryUser(ctx: Context) {
  const username = (ctx.request.query.username as string) ?? "";
  if (username) {
    const users = await UserModel.find({ username }).populate("room");
    ctx.body = {
      code: users ? 0 : 1,
      data: users ? users : [],
    };
  } else {
    ctx.body = {
      code: 1,
      message: "Please provide info to query user infomation.",
      data: [],
    };
  }
}

export async function Login(ctx: Context) {
  if (!ctx.request.body) {
    return (ctx.body = {
      data: null,
      code: 1,
      message: "must provide username or password!",
    });
  }
  const { username, password } = ctx.request.body;
  const userinfo = await UserModel.findOne({ username, password });
  if (userinfo) {
    var token = jwt.sign(String(userinfo._id), privateKey);
    ctx.cookies.set("token", token, { maxAge: 3600000, httpOnly: true });
    userinfo.password = "";
    ctx.body = {
      data: userinfo,
      code: 0,
      message: "login success",
    };
  } else {
    ctx.body = {
      code: 1,
      message: "password or username wrong",
    };
  }
}

export async function Register(ctx: Context) {
  if (!ctx.request.body) {
    return (ctx.body = {
      code: 1,
      message: "must provide username or password!",
    });
  }
  const { username, password } = ctx.request.body;
  const userInfo = await UserModel.findOne({ username });
  if (userInfo) {
    ctx.body = {
      code: 1,
      message: "This account is already occupied!",
    };
  } else {
    const userinfo = await UserModel.create({
      username,
      password,
    });
    var token = jwt.sign(String(userinfo._id), privateKey);
    ctx.cookies.set("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    userinfo.password = "";
    ctx.body = {
      code: 0,
      message: "Register account success",
      data: userinfo,
    };
  }
}

export async function Logout(ctx: Context) {
  ctx.cookies.set("token", null);
  ctx.body = {
    code: 0,
    message: "Logout success",
  };
}
/**
 * 一次只能添加一个好友, 不可重复添加已存在的好友.
 *
 * @param {*} ctx
 */
export async function AddFriend(ctx: Context) {
  const _id = (ctx.request.query._id as string) ?? "";
  const { username, image } = ctx.request.body;
  const cookie = ctx.cookies.get("token") ?? "";
  const userIdFromToken = jwt.verify(cookie, privateKey) as string;
  if (_id === userIdFromToken) {
    return (ctx.body = {
      code: 1,
      message: "cannot add yourself as friend",
    });
  }
  const isFriend = await UserModel.findOne({
    _id: userIdFromToken,
    // @ts-ignore
    friend: { $in: { _id: Types.ObjectId(_id) } },
  });
  if (isFriend) {
    return (ctx.body = {
      code: 1,
      message: "you are already friend.",
    });
  }
  // add friend
  await UserModel.updateOne(
    { _id: new Types.ObjectId(userIdFromToken) },
    { $addToSet: { friend: new Types.ObjectId(_id) } }
  );
  await UserModel.updateOne(
    { _id: new Types.ObjectId(_id) },
    { $addToSet: { friend: new Types.ObjectId(userIdFromToken) } }
  );
  // create room
  const roomResponse = await RoomModel.create({
    image,
    name: username,
    member: [userIdFromToken, _id],
    manager: new Types.ObjectId(userIdFromToken),
  });
  // update myself into a room id
  // update otherpersion into userid
  const data = await UserModel.updateOne(
    { _id: new Types.ObjectId(userIdFromToken) },
    { $addToSet: { room: roomResponse } }
  );
  await UserModel.updateOne(
    { _id: new Types.ObjectId(_id) },
    { $addToSet: { room: roomResponse } }
  );
  ctx.body = {
    code: 0,
    message: "Add friend success",
    data,
  };
}
/**
 * 删除好友.
 *
 * @param {*} ctx
 */
export async function DeleteFriend(ctx: Context) {
  const { _id } = ctx.request.query;
  const cookie = ctx.cookies.get("token") ?? "";
  const userIdFromToken = jwt.verify(cookie, privateKey);
  if (_id === userIdFromToken) {
    ctx.body = {
      code: 1,
      message: "cannot delete yourself as friend",
    };
  }
  // await UserModel.updateOne({ _id: Types.ObjectId(userIdFromToken) }, { $addToSet: { friend: Types.ObjectId(_id) } });
  // await UserModel.updateOne({ _id: Types.ObjectId(_id) }, { $addToSet: { friend: Types.ObjectId(userIdFromToken) } });
  ctx.body = {
    code: 0,
    message: "Delete friend success",
  };
}

export default {
  Login,
  Logout,
  Register,
  GetUserInfo,
  SetUserInfo,
  GetUserImage,
  QueryUser,
  AddFriend,
  DeleteFriend,
};
