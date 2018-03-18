'use strict';

module.exports = (pandora) => {
  pandora
    .process('chatroom')
    .env({
      NODE_ENV: 'prod',
      PORT: '8002',
      ACCESS_TOKE: '15c0e717d59205c5a23cd9deed51db2b6f051f3f',
    })
    .entry('./src/server/index.js');

  /**
   * more features please visit our document.
   * https://github.com/midwayjs/pandora/
   */
};
