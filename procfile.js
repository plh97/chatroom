'use strict';

module.exports = (pandora) => {
  pandora
    .process('chatroom')
    .env({
      NODE_ENV: 'prod',
    })
    .entry('./src/server/index.js');

  /**
   * more features please visit our document.
   * https://github.com/midwayjs/pandora/
   */
};
