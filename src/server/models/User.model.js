const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    _id: { type: String, default: '' },
    github: { type: Object, default: {} },
    groups: { type: Array, default: ['Moonlight'] },
    friends: { type: Array, default: [] },
});

const userModel = mongoose.model('users', userSchema);

class User {
    async save(data) {
        let isExist = await userModel.findOne({
            _id: data._id
        })
        if (isExist) {
            return userModel.update({
                login: data._id
            }, data).exec();
        } else {
            return new userModel(data).save();
        }
        return new userModel(data).save();
    }

    find(condition) {
        return userModel.find(condition).exec();
    }

    findOne(condition) {
        return userModel.findOne(condition).exec();
    }
}

module.exports = new User();