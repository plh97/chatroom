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
    console.log(userinfo)
    if (userinfo) {
        ctx.body = ({
            code: 0,
            message: 'get user info success!',
            data: {
                username
            }
        })
    } else {
        ctx.body = ({
            code: 0,
            message: 'user info not found!',
            data: {
                username
            }
        })
    }
};

async function Login(ctx) {
    if (!ctx.request.body) {
        return ctx.body = {
            data: {},
            code: 1,
            message: 'must provide username or password!'
        }
    }
    const { username, password } = ctx.request.body
    const userinfo = await UserModel.findOne({ username, password }).exec();
    console.log(11, userinfo);
    if (username === 'pengliheng' && password === 'ewqewq') {
        var token = jwt.sign(username, privateKey);
        ctx.cookies.set('token', token, { maxAge: 3600000, httpOnly: true });
        console.log('cookie created successfully', token);
        ctx.body = ({
            data: {
                token
            },
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
            data: {},
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
        const data = await UserModel.saveOne({
            username,
            password
        })
        var token = jwt.sign(username, privateKey);
        ctx.cookies.set('token', token, { maxAge: 3600000, httpOnly: true });
        console.log('cookie created successfully', token);
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
    UserInfo
}