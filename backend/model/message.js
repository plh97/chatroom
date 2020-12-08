const { Schema, Model, model } = require('mongoose')

const schema = new Schema({
    image: String,
    text: String,
    user: String,
    isRead: Boolean
});

class ModelClass extends Model {
    static saveOne(body) {
        return this.create(body);
    }
}

schema.loadClass(ModelClass);

module.exports = model('Message', schema);
