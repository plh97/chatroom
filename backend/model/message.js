const { Schema, Model, model, ObjectId } = require('mongoose')

const schema = new Schema({
    image: String,
    text: String,
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    isRead: Boolean
});

class ModelClass extends Model {
    static findAndReplaceUserInfo() {
        return this.find({}).populate('user').exec()
    }
}

schema.loadClass(ModelClass);

module.exports = model('Message', schema);
