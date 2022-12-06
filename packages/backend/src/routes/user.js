const jwt = require("jsonwebtoken");
const { privateKey } = require("../config");
const user = require("../model/user");
const UserModel = require("../model/user");
const RoomModel = require("../model/room");
const { Types } = require("mongoose");

/**
 * get user info through cookie
 * @param {*} ctx
 */
async function GetUserInfo(ctx) {
  const cookie = ctx.cookies.get("token");
  const _id = await new Promise((resolve, reject) => {
    jwt.verify(cookie, privateKey, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
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
async function SetUserInfo(ctx) {
  const { image } = ctx.request.body;
  const cookie = ctx.cookies.get("token");
  const _id = await new Promise((resolve, reject) => {
    jwt.verify(cookie, privateKey, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
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

async function GetUserImage(ctx) {
  const { username } = ctx.request.query;
  if (username) {
    const userinfo = await UserModel.findOne({ username });
    if (userinfo) {
      userinfo.password = undefined;
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

async function QueryUser(ctx) {
  const { username } = ctx.request.query;
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

async function Login(ctx) {
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
    console.log(userinfo);
    var token = jwt.sign(String(userinfo._id), privateKey);
    ctx.cookies.set("token", token, { maxAge: 3600000, httpOnly: true });
    userinfo.password = undefined;
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

async function Register(ctx) {
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
    userinfo.password = undefined;
    ctx.body = {
      code: 0,
      message: "Register account success",
      data: userinfo,
    };
  }
}

async function Logout(ctx) {
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
async function AddFriend(ctx, next) {
  const { _id, username, image } = ctx.request.body;
  const cookie = ctx.cookies.get("token");
  const userIdFromToken = await new Promise((resolve, reject) => {
    jwt.verify(cookie, privateKey, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
  if (_id === userIdFromToken) {
    return (ctx.body = {
      code: 1,
      message: "cannot add yourself as friend",
    });
  }
  const isFriend = await UserModel.findOne({
    _id: userIdFromToken,
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
    { _id: Types.ObjectId(userIdFromToken) },
    { $addToSet: { friend: Types.ObjectId(_id) } }
  );
  await UserModel.updateOne(
    { _id: Types.ObjectId(_id) },
    { $addToSet: { friend: Types.ObjectId(userIdFromToken) } }
  );
  // create room
  const roomResponse = await RoomModel.create({
    image,
    name: username,
    member: [userIdFromToken, _id],
    manager: Types.ObjectId(userIdFromToken),
  });
  // update myself into a room id
  // update otherpersion into userid
  const data = await UserModel.updateOne(
    { _id: Types.ObjectId(userIdFromToken) },
    { $addToSet: { room: roomResponse } }
  );
  await UserModel.updateOne(
    { _id: Types.ObjectId(_id) },
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
async function DeleteFriend(ctx) {
  const { _id } = ctx.request.query;
  const cookie = ctx.cookies.get("token");
  const userIdFromToken = await new Promise((resolve, reject) => {
    jwt.verify(cookie, privateKey, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
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

module.exports = {
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
