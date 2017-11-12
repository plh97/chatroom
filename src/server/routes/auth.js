const rp = require('request-promise');
const config = require('../../../config/server');
const mAuthUser = require('../models/Auth.model');

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
    let isExist = await mAuthUser.find({ login: userInfo.login });
    console.log(isExist);
    if (isExist.length) {
        console.log('update');
        let newAuther = {
            login: userInfo.login,
            name: (userInfo.name ? userInfo.name : userInfo.login),
            avatar_url: userInfo.avatar_url
        };
        let updateAuthUser = await mAuthUser.update({
            login: newAuther.login
        }, newAuther);
        console.log(updateAuthUser);
    } else {
        console.log('save');
        let newAuther = {
            login: userInfo.login,
            name: (userInfo.name ? userInfo.name : userInfo.login),
            avatar_url: userInfo.avatar_url
        };
        let saveAuthUser = await mAuthUser(newAuther).save();
        console.log(saveAuthUser);
    }
}
