const jwt = require('jsonwebtoken');
const { privateKey } = require('../config');
const user = require('../model/user');
const UserModel = require('../model/user')

async function UserInfo(ctx) {
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
            message: 'get user info success!',
            data: userinfo
        })
    } else {
        ctx.body = ({
            code: 0,
            message: 'user info not found!',
            data: null
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
                message: 'get user info success!',
                data: userinfo.image
            })
        } else {
            ctx.body = ({
                code: 0,
                message: 'user info not found!',
                data: null
            })
        }
    } else {
        ctx.body = ({
            code: 0,
            message: 'please provide username',
            data: null
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
        console.log('cookie created successfully', token);
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
        ctx.cookies.set('token', token, { maxAge: 3600000, httpOnly: true });
        console.log('cookie created successfully', token);
        data.password = undefined;
        ctx.body = ({
            code: 0,
            message: 'Register account success',
            data
        })
    }
}

module.exports = {
    Login,
    Register,
    UserInfo,
    GetUserImage,
}