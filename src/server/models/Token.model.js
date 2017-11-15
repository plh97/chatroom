const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tokenSchema = new Schema({
    access_token: { type: String, default: '' },
    _id: { type: String, default: '' }
});

const tokenModel = mongoose.model('tokens', tokenSchema);

class token {
    //save contant feature 
    //if has ,updata()
    //if no found ,save()
    //to use async feature ,then wait you found the mongod datebase
    async save(data) {
        let isExist = await tokenModel.findOne({
            _id: data._id
        })
        if (isExist) {
            return tokenModel.update({
                _id: data._id
            }, data).exec();
        } else {
            //save
            return new tokenModel(data).save();
        }
    }

    findOne(data) {
        return tokenModel.findOne(data).exec();
    }
}

module.exports = new token();