const MessageModel = require('../model/message')

const getMessage = async (ctx) => {
    ctx.body = {
        code: 0,
        data: await MessageModel.findAndReplaceUserInfo()
    }
};

const sendMessage = async (ctx) => {
    const body = ctx.request.body
    const res = await MessageModel.create(body)
    ctx.body = ({
        code: 0,
        data: res
    })
};

const deleteMessage = async (ctx) => {
    const body = ctx.request.body
    const res = await MessageModel.deleteMany(body)
    ctx.body = ({
        code: 0,
        data: res
    })
};

module.exports = {
    sendMessage,
    getMessage,
    deleteMessage
};
