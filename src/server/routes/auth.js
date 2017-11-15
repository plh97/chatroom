const rp = require('request-promise');
const User = require('../models/User.model');
const Token = require('../models/Token.model');
const config = require('../../../config/server');

/**
 * 获取github code的方法
 * @param  {string} access_token
 * @return {async} 
 */

exports.getCode = async (ctx, next) => {
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
        'httpOnly': false
    })
    ctx.redirect('/')
    //将user信息写入数据库,重写方法，有就更新，没有就保存
    await User.save({
        _id: userInfo.id,
        github:userInfo
    });
    //将token写入数据库,重写方法，有就更新，没有就保存
    await Token.save({
        access_token: tokenResp.access_token,
        _id: userInfo.id
    })
}
