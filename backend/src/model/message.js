const { Schema, Model, model, ObjectId } = require('mongoose')

const schema = new Schema({
    image: String,
    text: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    createTime: { type: Date, default: Date.now },
    isRead: Boolean
});

class ModelClass extends Model {
    static async findAndReplaceUserInfo({
        page = 1,
        pageSize = 20
    }) {
        return this
            .find({})
            .skip(await this.collection.count() - page * pageSize)
            .limit(pageSize)
            .populate('user')
            .exec()
    }
}

schema.loadClass(ModelClass);

module.exports = model('Message', schema);
