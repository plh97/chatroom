const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const authUserSchema = new Schema({
    login: String,
    name: String,
    avatar_url: String,
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