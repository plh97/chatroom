const MessageModel = require('../model/message')

const getMessage = async (ctx) => {
    ctx.body = {
        code: 0,
        data: await MessageModel.findAndReplaceUserInfo()
    }
};

const sendMessage = async (ctx) => {
    const body = ctx.request.body
    const msg = await MessageModel.create(body)
    const data = await MessageModel.findOne(msg).populate('user').exec()
    ctx.body = ({
        code: 0,
        data
    })
};

const deleteMessage = async (ctx) => {
    const { _id } = ctx.request.body;
    const message = await MessageModel.findOne({ _id });
    console.log(message, _id, ctx.request.body)
    const res = await MessageModel.deleteOne(message);
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
