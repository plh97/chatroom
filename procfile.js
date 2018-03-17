'use strict';

module.exports = (pandora) => {

  pandora
    .fork('init', './keystone.js');

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