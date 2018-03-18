'use strict';

module.exports = (pandora) => {
  pandora
    .process('chatroom')
    .entry('./src/server/index.js');

  /**
   * more features please visit our document.
   * https://github.com/midwayjs/pandora/
   */
};
