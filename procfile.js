'use strict';

module.exports = (pandora) => {
  pandora
    .process('chatroom')
    .env({
      NODE_ENV: 'prod',
      PORT: '8002',
      ACCESS_TOKE: '7f77521d5ac579d61a3cd8f9b77cff4c07da8780',
    })
    .entry('./src/server/index.js');

  /**
   * more features please visit our document.
   * https://github.com/midwayjs/pandora/
   */
};
