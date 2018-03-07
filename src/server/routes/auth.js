const rp = require('request-promise');
const User = require('../models/User.model');
const Token = require('../models/Token.model');
const config = require('../../../config/project');

/**
 * 获取github code的方法
 * @param  {string} access_token
 * @return {async}
 */

const Auth = async (ctx) => {
  const redirectUri = ctx.cookies.get('redirect_uri');
  const { code } = ctx.request.query;
  let option = {
    uri: 'https://github.com/login/oauth/access_token',
    qs: {
      client_id: config.githubClientID,
      client_secret: config.githubClientSecret,
      code,
    },
    json: true,
  };
  const tokenResp = await rp(option);
  // console.log('tokenize',tokenize);
  option = {
    uri: 'https://api.github.com/user',
    qs: {
      access_token: tokenResp.access_token,
    },
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
  };
  const userInfo = await rp(option);
  ctx.cookies.set('access_token', tokenResp.access_token, {
    httpOnly: true,
  });
  ctx.redirect(redirectUri);
  await User.save({
    github: userInfo,
  });
  await Token.register({
    access_token: tokenResp.access_token,
    user_id: userInfo.id,
  });
};

module.exports = Auth;
