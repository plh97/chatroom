const fs = require('fs');
// const { backendOrigin } = require('../config');
const path = require('path');
const Mime = require('../utils/mime')
const mime = new Mime();

const Upload = async (ctx) => {
    const file = ctx.request.files.file;
    console.log(ctx.request.origin);
    const ext = mime.getType(file.type);
    const name = `${Math.random().toString().replace(/0./, '')}.${ext}`;
    const newpath = path.resolve('static', name);
    const topath = fs.createWriteStream(newpath);
    const stream = await fs.createReadStream(file.path).pipe(topath);
    await new Promise((resolve) => {
        stream.on('finish', async () => {
            resolve();
        });
    });
    ctx.body = {
        code: 0,
        data: `${ctx.request.origin}:9002/${name}`
    }
};


module.exports = {
    Upload,
};
