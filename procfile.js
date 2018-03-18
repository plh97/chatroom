'use strict';

module.exports = (pandora) => {
  pandora
    .process('chatroom')
    .env({
      NODE_ENV: 'prod',
      PORT: '8002',
    })
    .entry('./src/server/index.js');

  /**
   * more features please visit our document.
   * https://github.com/midwayjs/pandora/
   */
};
