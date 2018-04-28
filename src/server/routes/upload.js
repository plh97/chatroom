// apk
const fs = require('fs-extra');
const path = require('path');
// const promise = require('bluebird');

// local
const uploadFile = require('../utils/qiniu.js');
const { getType } = require('../utils/mimes.js');

/**
 * 获取github code的方法
 * @param  {string} upload file
 * @return {async}
 */

const Upload = async (ctx, next) => {
  if (ctx.method !== 'POST') return await next();
  let { images } = ctx.request.body.files;
  if (!images.length) {
    images = [images];
  }
  ctx.body = await Promise.all(images.map(async (image) => {
    const ext = getType(image.type);
    const name = `${Math.random().toString().replace(/0./, '')}.${ext}`;
    const newpath = path.resolve(`./public/${name}`);
    const topath = fs.createWriteStream(newpath);
    const stream = await fs.createReadStream(image.path).pipe(topath);
    const result = await new Promise((resolve) => {
      stream.on('finish', async () => {
        // const callback = await uploadFile(name, newpath);
        resolve({
          name,
          url: `http://pipk.top:8080/chat/public/${name}`,
        });
      });
    });
    return result;
  }));
};

module.exports = Upload;
