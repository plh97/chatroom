const rp = require('request-promise');
const cookie = require('cookie');
const User = require('../models/User.model');
const Token = require('../models/Token.model');
const Group = require('../models/Group.model');
const config = require('../../../config/server');

/**
 * 获取github code的方法
 * @param  {string} access_token
 * @return {async} 
 */

exports.getCode = async (ctx, next) => {
    let redirect_uri = ctx.cookies.get('redirect_uri')
    let code = ctx.request.query["code"];
    let option = {
        uri: `https://github.com/login/oauth/access_token`,
        qs: {
            client_id: config.githubClientID,
            client_secret: config.githubClientSecret,
            code: code
        },
        json: true
    }
    let tokenResp = await rp(option);
    option = {
        uri: `https://api.github.com/user`,
        qs: {
            access_token: tokenResp.access_token
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    }
    let userInfo = await rp(option);
    ctx.cookies.set('access_token', tokenResp.access_token, {
        'httpOnly': true
    })
    //初次到访用户
    //将用户github 信息保存，加入默认群，token储存
    ctx.redirect(redirect_uri)
    //用户github信息储存/更新
    console.log('user save');
    await User.save({
        github:userInfo
    });
    //用户加入默认群
    // await User.save({
    //     github:userInfo
    // });
    //token储存/更新
    console.log('token save');
    await Token.save({
        access_token: tokenResp.access_token,
        user_id: userInfo.id
    })
}
