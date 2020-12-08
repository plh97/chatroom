const MessageModel = require('../model/message')

const getMessage = async (ctx) => {
    ctx.body = {
        code: 0,
        data: await MessageModel.find({}).exec()
    }
};

const sendMessage = async (ctx) => {
    const body = ctx.request.body
    const res = await MessageModel.saveOne(body)
    ctx.body = ({
        code: 0,
        data: res
    })
};

module.exports = {
    sendMessage,
    getMessage
};
