import { Context } from "koa";
import { verify } from "jsonwebtoken";
import { Types } from "mongoose";
import { privateKey } from "@/config";
import RoomModel from "@/model/room";
import UserModel from "@/model/user";
// import { getWS } from "@/ws";

export const getRoom = async (ctx: Context) => {
  const _id = (ctx.request.query._id as string) ?? "";
  const page = Number(ctx.request.query.page ?? "1");
  const pageSize = Number(ctx.request.query.pageSize ?? "20");
  const data = await RoomModel.findOne({
    _id: Types.ObjectId(_id),
  }).populate("message.user");
  const message = data.message;
  const totalCount = data.message.length;
  ctx.getWS(_id);
  ctx.body = {
    code: 0,
    data: {
      totalCount,
      message: message.slice(
        totalCount < page * pageSize ? 0 : totalCount - page * pageSize,
        totalCount - (page - 1) * pageSize
      ),
    },
  };
};

export const addRoom = async (ctx: Context) => {
  const body: { member: string[] } = ctx.request.body;
  const cookie = ctx.cookies.get("token") ?? "";
  const userIdFromToken = verify(cookie, privateKey) as string;
  const roomResponse = await RoomModel.create({
    ...body,
    member: [Types.ObjectId(userIdFromToken), ...body.member],
    manager: Types.ObjectId(userIdFromToken),
  });
  // update myself into a room id
  await UserModel.updateOne(
    { _id: Types.ObjectId(userIdFromToken) },
    { $addToSet: { room: roomResponse } }
  );
  // update otherpersion into userid
  await Promise.all(
    body.member.map((id) =>
      UserModel.updateOne(
        { _id: Types.ObjectId(id) },
        { $addToSet: { room: roomResponse } }
      )
    )
  );
  ctx.body = {
    code: 0,
    message: "Create room success",
  };
};

export const modifyRoom = async (ctx: Context) => {
  const body = ctx.request.body;
  const msg = await RoomModel.create(body);
  const data = await RoomModel.findOne(msg).populate("user");
  ctx.body = {
    code: 0,
    data,
  };
};

export const deleteRoom = async (ctx: Context) => {
  const { _id } = ctx.request.query;
  const res = await RoomModel.deleteOne({ _id });
  ctx.body = {
    code: 0,
    data: res,
  };
};

export const addMessage = async (ctx: Context) => {
  const body = ctx.request.body;
  // add new message
  // update room last modify time
  await RoomModel.updateOne(
    { _id: body.roomId },
    { $addToSet: { message: body } }
  ).updateOne({ _id: body.roomId }, { $set: { updatedAt: new Date() } });
  const data = await RoomModel.findOne({ _id: body.roomId }).populate(
    "message.user"
  );
  const namespace = ctx.getWS(body.roomId);
  const message = data.message[data.message.length - 1];
  namespace.send(message);
  ctx.body = {
    code: 0,
    data: message,
  };
};

export const deleteMessage = async (ctx: Context) => {
  const { roomId, messageId } = ctx.request.query as {
    roomId: string;
    messageId: string;
  };
  const res = await RoomModel.updateOne(
    { _id: roomId },
    { $pull: { message: { _id: Types.ObjectId(messageId) } } }
  );
  ctx.body = {
    code: 0,
    data: res,
  };
};

export default {
  addRoom,
  getRoom,
  modifyRoom,
  deleteRoom,
  addMessage,
  deleteMessage,
};