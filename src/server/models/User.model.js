const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Group = require('./Group.model')
const userSchema = new Schema({
    _id: { type: String, default: '' },
    github: { type: Object, default: {} },
    groups: { type: Array, default: [] },
    friends: { type: Array, default: [] },
});

const userModel = mongoose.model('users', userSchema);

class User {
    find(data){
        return userModel.find(data)
    }
    async findOne(data){
        return userModel.findOne(data)
    }
    update(before,after){
        return userModel.update(before,after).exec();
    }
    create(data){
        return userModel(data).save();
    }
    async save(data) {
        //没有group，需要创建group，
        let isGroupExist = await Group.find({})
        !isGroupExist.length && await Group.create({
            administratorList: [data.github.id],
            memberList: [data.github.id],
            creator: [data.github.id],
        })
        let defaultGroup = await Group.findFirst()
        //查询user，有就更新，没有user就要创建
        //创建usr,加入默认group   用户，首次登录，
        let isUserExist = await this.find({})
        if(isUserExist.length){
            //is exist,update
            await this.update({
                _id: data.github.id,
            },{
                _id: data.github.id,
                github:data.github,
            })
        }else{
            // not exist , save,create
            await this.create({
                _id: data.github.id,
                github: data,
                groups: [defaultGroup._id.toString()]
            });
        }
    }
}

module.exports = new User();