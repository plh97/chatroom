const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const authUserSchema = new Schema({
    login: { type: String, default: 'LoL' },
    name: { type: String, default: 'LoL' },
    avatar_url: { type: String, default: '' }
});

const authUserModel = mongoose.model('authuser', authUserSchema);

class authUser {
    save(data) {
        return new authUserModel(data).save();
    }

    update(data) {
        return authUserModel.update({
            login: data.login
        }, data).exec();
    }

    find(condition) {
        return authUserModel.find(condition).exec();
    }
}

module.exports = new authUser();