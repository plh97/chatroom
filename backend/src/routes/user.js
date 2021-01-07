const jwt = require('jsonwebtoken');
const { privateKey } = require('../config');
const user = require('../model/user');
const UserModel = require('../model/user')

/**
 * get user info through cookie
 * @param {*} ctx
 */
async function GetUserInfo(ctx) {
    const cookie = ctx.cookies.get('token')
    const username = await new Promise((resolve, reject) => {
        jwt.verify(cookie, privateKey, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    })
    const userinfo = await UserModel.findOne({ username }).exec();
    if (userinfo) {
        userinfo.password = undefined;
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

async function SetUserInfo(ctx) {
    const { username, image } = ctx.request.body
    const cookie = ctx.cookies.get('token')
    const usernameFromToken = await new Promise((resolve, reject) => {
        jwt.verify(cookie, privateKey, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    })
    await UserModel.updateOne({ username: usernameFromToken }, { $set: { image } });
    const userinfo = await UserModel.findOne({ username: usernameFromToken })
    if (userinfo) {
        userinfo.password = undefined;
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
        var token = jwt.sign(username, privateKey);
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
        const data = await UserModel.create({
            username,
            password,
            image: 'https://avatars3.githubusercontent.com/u/14355994?s=460&u=1f1d3a174d2e0f79bcd5379a4d832fa9d0777ff3&v=4'
        })
        var token = jwt.sign(username, privateKey);
        ctx.cookies.set('token', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
        data.password = undefined;
        ctx.body = ({
            code: 0,
            message: 'Register account success',
            data
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

async function AddFriend(ctx) {
    const { _id } = ctx.request.body
    const cookie = ctx.cookies.get('token')
    const usernameFromToken = await new Promise((resolve, reject) => {
        jwt.verify(cookie, privateKey, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    })
    const res = await UserModel.updateOne({ username: usernameFromToken }, { $push: { friend: _id } });
    ctx.body = ({
        code: 0,
        data: res
    })
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