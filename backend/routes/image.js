
const MessageModel = require('../model/message')

const Upload = async (ctx) => {
    const file = ctx.request.files;
    console.log(
        111,
        file
    )
    ctx.body = {
        code: 0,
        data: await MessageModel.findAndReplaceUserInfo()
    }
};


module.exports = {
    Upload,
};
