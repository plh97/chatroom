'use strict';

const cookie = require('cookie');

/**
 * 读取文件方法
 * @param  {socket|cookie} koa-socket's argument 
 * @return {string|json} get access_token || ''
 */

module.exports = socket => {
    return cookie.parse(socket.data.socket.handshake.headers.cookie||'')
};
