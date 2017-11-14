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
    save(data) {
        return new userModel(data).save();
    }

    update(data) {
        return userModel.update({
            login: data.login
        }, data).exec();
    }

    find(condition) {
        return userModel.find(condition).exec();
    }
}

module.exports = new User();