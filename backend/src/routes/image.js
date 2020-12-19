const fs = require('fs');
const UserModel = require('../model/user')
const { privateKey, backendOrigin } = require('../config');
const path = require('path');

const Upload = async (ctx) => {
    const file = ctx.request.files.file;
    fs.writeFile(path.resolve('static', 'image', file.name), file._writeStream, function() {
        console.log(23)
    })
    console.log(
        111,
        file
    )

    ctx.body = {
        code: 0,
        data: `${backendOrigin}/image/${file.name}`
    }
};


module.exports = {
    Upload,
};
