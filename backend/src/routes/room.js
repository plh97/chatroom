const RoomModel = require('../model/room')
const {verify} = require('jsonwebtoken');
const { privateKey } = require('../config');

const getRoom = async (ctx) => {
    const { index, pageSize } = ctx.request.query;
    ctx.body = {
        code: 0,
        data: await RoomModel.find({}),
    }
};

const addRoom = async (ctx) => {
    const body = ctx.request.query
    const cookie = ctx.cookies.get('token')
    const userIdFromToken = await new Promise((resolve, reject) => {
      verify(cookie, privateKey, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
    const msg = await RoomModel.create({
        ...body,
        member: [userIdFromToken],
        manager: userIdFromToken
    })
    ctx.body = ({
        code: 0,
        message: 'Create room success'
    })
};


const modifyRoom = async (ctx) => {
    const body = ctx.request.body
    const msg = await RoomModel.create(body)
    const data = await RoomModel.findOne(msg).populate('user').exec()
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

module.exports = {
    addRoom,
    getRoom,
    modifyRoom,
    deleteRoom
};
