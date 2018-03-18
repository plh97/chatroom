'use strict';

module.exports = (pandora) => {
  pandora('chat')
    .env({
      NODE_ENV: 'prod',
      PORT: '8002',
    })
    .fork('init', './src/server/index.js');

  /**
   * you can also use cluster mode to start application
   */
  // pandora
  //   .cluster('./keystone.js');

  /**
   * you can create another process here
   */
  // pandora
  //   .process('background')
  //   .nodeArgs(['--expose-gc']);

  /**
   * more features please visit our document.
   * https://github.com/midwayjs/pandora/
   */
};
