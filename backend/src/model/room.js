const { Schema, Model, model } = require('mongoose')

const schema = new Schema({
    image: String,
    name: String,
    // image: {type: String, default: 'https://avatars3.githubusercontent.com/u/14355994?s=460&u=1f1d3a174d2e0f79bcd5379a4d832fa9d0777ff3&v=4'},
    image: {type: String, default: 'https://m.media-amazon.com/images/M/MV5BZmQ5NGFiNWEtMmMyMC00MDdiLTg4YjktOGY5Yzc2MDUxMTE1XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_UY1200_CR93,0,630,1200_AL_.jpg'},
    member: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    manager: { type: Schema.Types.ObjectId, ref: 'User' },
    createTime: { type: Date, default: Date.now },
});

class ModelClass extends Model {
}

schema.loadClass(ModelClass);

module.exports = model('Room', schema);
