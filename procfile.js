'use strict';

module.exports = (pandora) => {
  pandora
    .process('chatroom')
    .env({
      ...process.env,
    })
    .entry('./src/server/index.js');

  /**
   * more features please visit our document.
   * https://github.com/midwayjs/pandora/
   */
};
