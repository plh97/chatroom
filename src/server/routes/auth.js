const rp = require('request-promise');
const config = require('../../../config/server');
const User = require('../models/User.model');

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
    let isExist = await User.find({ _id: userInfo.id });
    let newUser = {
        _id: userInfo.id,
        github:userInfo
    };
    if (isExist.length) {
        await User.update({
            _id: userInfo.id
        }, newUser);
    } else {
        await User.save(newUser);
    }
}
