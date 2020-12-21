const MessageModel = require('../model/message')

const getMessage = async (ctx) => {
    const { page, pageSize } = ctx.request.query;
    ctx.body = {
        code: 0,
        data: await MessageModel.findAndReplaceUserInfo({
            page, pageSize
        })
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
    const { _id } = ctx.request.query;
    const res = await MessageModel.deleteOne({ _id });
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
