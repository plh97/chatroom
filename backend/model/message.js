const { Schema, Model, model, ObjectId } = require('mongoose')

const schema = new Schema({
    image: String,
    text: String,
    user: {type: String, ref: 'User'},
    isRead: Boolean
});

class ModelClass extends Model {
    // static saveOne(body) {
    //     return this.create(body);
    // }
    static findAndReplaceUserInfo() {
        return this.find({}).populate('User').exec()
    }
}

schema.loadClass(ModelClass);

module.exports = model('Message', schema);
