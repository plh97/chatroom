const { Schema, Model, model } = require('mongoose')

const schema = new Schema({
    image: String,
    name: String,
    member: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    manager: { type: Schema.Types.ObjectId, ref: 'User' },
    createTime: { type: Date, default: Date.now },
});

class ModelClass extends Model {
    static async findAndReplaceUserInfo({
        index = 0,
        pageSize = 20
    }) {
        const totalCount = await this.collection.count();
        if (totalCount == index) {
            return []
        }
        return this.find({})
            .populate('member')
            .exec()
    }
}

schema.loadClass(ModelClass);

module.exports = model('Room', schema);
