const { Schema, Model, model } = require('mongoose');
const { roomIcon } = require('../config')

const schema = new Schema({
    name: {type: String, default: 'default room name'},
    // image: {type: String, default: 'https://avatars3.githubusercontent.com/u/14355994?s=460&u=1f1d3a174d2e0f79bcd5379a4d832fa9d0777ff3&v=4'},
    image: {type: String, default: roomIcon},
    member: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    manager: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    message: [{
        images: Array,
        text: String,
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
        isRead: Boolean
    }]
});

class ModelClass extends Model {
}

schema.loadClass(ModelClass);

module.exports = model('Room', schema);
