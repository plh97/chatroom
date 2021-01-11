const jwt = require('jsonwebtoken');
const { privateKey } = require('../config');
const user = require('../model/user');
const UserModel = require('../model/user');
const RoomModel = require('../model/room');

/**
 * get user info through cookie
 * @param {*} ctx
 */
async function GetUserInfo(ctx) {
    const cookie = ctx.cookies.get('token')
    const _id = await new Promise((resolve, reject) => {
        jwt.verify(cookie, privateKey, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    })
    const userinfo = await UserModel.findOne({ _id }).populate('friend').exec();
    if (userinfo) {
        const room = await RoomModel.find({}).exec()
        userinfo.room = room;
        console.log((userinfo));
        ctx.body = ({
            code: 0,
            data: userinfo,
        })
    } else {
        ctx.body = ({
            code: 0
        })
    }
};
/**
 * 只能设置自己的信息
 *
 * @param {*} ctx
 */
async function SetUserInfo(ctx) {
    const { image } = ctx.request.body
    const cookie = ctx.cookies.get('token')
    const _id = await new Promise((resolve, reject) => {
        jwt.verify(cookie, privateKey, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    })
    await UserModel.updateOne({ _id }, { $set: { image } });
    const userinfo = await UserModel.findOne({ _id })
    if (userinfo) {
        ctx.body = ({
            code: 0,
            data: userinfo
        })
    } else {
        ctx.body = ({
            code: 0
        })
    }
};

async function GetUserImage(ctx) {
    const { username } = ctx.request.query
    if (username) {
        const userinfo = await UserModel.findOne({ username }).exec();
        if (userinfo) {
            userinfo.password = undefined;
            ctx.body = ({
                code: 0,
                data: userinfo.image
            })
        } else {
            ctx.body = ({
                code: 1,
                data: null
            })
        }
    } else {
        ctx.body = ({
            code: 0,
            data: null
        })
    }
};

async function QueryUser(ctx) {
    const { username } = ctx.request.query
    if (username) {
        const users = await UserModel.find({ username }).populate('room').exec();
        ctx.body = {
            code: users ? 0 : 1,
            data: users ? users : []
        }
    } else {
        ctx.body = ({
            code: 1,
            message: 'Please provide info to query user infomation.',
            data: []
        })
    }
};

async function Login(ctx) {
    if (!ctx.request.body) {
        return ctx.body = {
            data: null,
            code: 1,
            message: 'must provide username or password!'
        }
    }
    const { username, password } = ctx.request.body
    const userinfo = await UserModel.findOne({ username, password }).exec();
    if (userinfo) {
        console.log(userinfo)
        var token = jwt.sign(String(userinfo._id), privateKey);
        ctx.cookies.set('token', token, { maxAge: 3600000, httpOnly: true });
        userinfo.password = undefined;
        ctx.body = ({
            data: userinfo,
            code: 0,
            message: 'login success'
        })
    } else {
        ctx.body = ({
            code: 1,
            message: 'password or username wrong'
        })
    }
};

async function Register(ctx) {
    if (!ctx.request.body) {
        return ctx.body = {
            data: null,
            code: 1,
            message: 'must provide username or password!'
        }
    }
    const { username, password } = ctx.request.body
    const userInfo = await UserModel.findOne({ username }).exec();
    if (userInfo) {
        ctx.body = ({
            code: 1,
            message: 'This account is already occupied!'
        })
    } else {
        const userinfo = await UserModel.create({
            username,
            password,
        })
        var token = jwt.sign({_id: userinfo._id}, privateKey);
        ctx.cookies.set('token', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
        userinfo.password = undefined;
        ctx.body = ({
            code: 0,
            message: 'Register account success',
            data: userinfo
        })
    }
}

async function Logout(ctx) {
    ctx.cookies.set('token', null);
    ctx.body = ({
        code: 0,
        message: 'Logout success'
    })
}
/**
 * 一次只能添加一个好友, 不可重复添加已存在的好友.
 *
 * @param {*} ctx
 */
async function AddFriend(ctx) {
    const { _id } = ctx.request.query
    const cookie = ctx.cookies.get('token')
    const userIdFromToken = await new Promise((resolve, reject) => {
        jwt.verify(cookie, privateKey, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    })
    if (_id === userIdFromToken) {
        ctx.body = {
            code: 0,
            message: 'cannot add yourself as friend'
        }
    } else {
        // 双方互加
        await UserModel.updateOne({ _id: userIdFromToken }, { $addToSet: { friend: _id } });
        await UserModel.updateOne({ _id }, { $addToSet: { friend: userIdFromToken } });
        ctx.body = ({
            code: 0,
            message: 'Add friend success'
        })
    }
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
}