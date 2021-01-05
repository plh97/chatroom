const { Schema, Model, model } = require('mongoose')

const schema = new Schema({
    image: String,
    username: String,
    password: { type: String, required: true, select: false },
    bio: String,
    qq: String,
    wechat: String,
    github: String,
    permission: String,
    room: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
});

class ModelClass extends Model {
    static saveOne(body) {
        return this.create(body);
    }
}

schema.loadClass(ModelClass);

module.exports = model('User', schema);
