const RoomModel = require('../model/room')
const { verify } = require('jsonwebtoken');
const { privateKey } = require('../config');
const UserModel = require('../model/user');
const { Types } = require('mongoose');

const getRoom = async (ctx) => {
    const {
        page = 1,
        pageSize = 20,
        _id
    } = ctx.request.query;
    const data = await RoomModel
        .findOne(
            { _id: Types.ObjectId(_id) },
        )
        .populate('message.user')
    const message = data.message;
    const totalCount = data.message.length;
    ctx.body = {
        code: 0,
        data: {
            totalCount,
            message: message.slice(
                totalCount < page * pageSize ? 0 : totalCount - page * pageSize,
                totalCount - (page - 1) * pageSize
            )
        }
    }
};

const addRoom = async (ctx) => {
    const body = ctx.request.body
    const cookie = ctx.cookies.get('token')
    const userIdFromToken = await new Promise((resolve, reject) => {
        verify(cookie, privateKey, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    });
    const roomResponse = await RoomModel.create({
        ...body,
        member: [
            Types.ObjectId(userIdFromToken),
            ...body.member,
        ],
        manager: Types.ObjectId(userIdFromToken)
    })
    // update myself into a room id
    await UserModel.updateOne({ _id: Types.ObjectId(userIdFromToken) }, { $addToSet: { room: roomResponse } });
    // update otherpersion into userid
    await Promise.all(body.member.map(id => new Promise(async (resolve, reject) => {
        UserModel.updateOne({ _id: Types.ObjectId(id) }, { $addToSet: { room: roomResponse } }, (err, res) => {
            if (err) reject(err);
            resolve(res)
        });
    })))
    ctx.body = ({
        code: 0,
        message: 'Create room success'
    })
};


const modifyRoom = async (ctx) => {
    const body = ctx.request.body
    const msg = await RoomModel.create(body)
    const data = await RoomModel.findOne(msg).populate('user')
    ctx.body = ({
        code: 0,
        data
    })
};

const deleteRoom = async (ctx) => {
    const { _id } = ctx.request.query;
    const res = await RoomModel.deleteOne({ _id });
    ctx.body = ({
        code: 0,
        data: res
    })
};


const addMessage = async (ctx) => {
    const body = ctx.request.body
    // add new message
    // update room last modify time
    await RoomModel
        .updateOne({ _id: body.roomId }, { $addToSet: { message: body } })
        .updateOne({ _id: body.roomId }, { $set: { updatedAt: new Date() } })
    const data = await RoomModel
        .findOne({ _id: body.roomId })
        .populate('message.user')
    ctx.body = ({
        code: 0,
        data: data.message[data.message.length - 1]
    })
};

const deleteMessage = async (ctx) => {
    const { roomId, messageId } = ctx.request.query;
    const res = await RoomModel.updateOne({ _id: roomId }, { $pull: { message: { _id: Types.ObjectId(messageId) } } })
    ctx.body = ({
        code: 0,
        data: res
    })
};


module.exports = {
    addRoom,
    getRoom,
    modifyRoom,
    deleteRoom,
    addMessage,
    deleteMessage,
};
