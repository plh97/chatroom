// apk
const fs = require('fs-extra');
const path = require('path');
const promise = require('bluebird');

// local
// const User = require('../models/User.model');
// const Token = require('../models/Token.model');
// const Group = require('../models/Group.model');
// const config = require('../../../config/project');
const uploadFile = require('../utils/qiniu.js');
const { getType } = require('../utils/mimes.js');

/**
 * 获取github code的方法
 * @param  {string} upload file
 * @return {async}
 */

exports.getCode = async (ctx, next) => {
  if (ctx.method !== 'POST') return await next();
  let { images } = ctx.request.body.files;
  if (!images.length) {
    images = [images];
  }
  ctx.body = await new promise.all(await images.map(async (image) => {
    const ext = getType(image.type);
    const name = `${Math.random().toString().replace(/0./, '')}.${ext}`;
    const newpath = path.resolve(`./public/${name}`);
    const topath = fs.createWriteStream(newpath);
    const stream = await fs.createReadStream(image.path).pipe(topath);
    return await new promise((resolve, reject) => {
      stream.on('finish', async () => {
        const callback = await uploadFile(name, newpath);
        resolve({
          name: callback.key,
          url: callback.url,
        });
      });
    });
  }));
};