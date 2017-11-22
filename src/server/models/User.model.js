const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Group = require('./Group.model')
const userSchema = new Schema({
    user_id: { type: String, default: '' },
    github: { type: Object, default: {} },
    groups: [
        { type: String, default: '' }
    ],
    friends: [
        { type: String, default: '' }
    ]
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
        return userModel.update(before,after);
    }
    async save(data) {
        //没有group，需要创建group，
        let isGroupExist = await Group.find({})
        console.log('isGroupExist',isGroupExist);
        !isGroupExist.length && await Group.create({
            group_name:'Moonlight',
            administratorList: [data.github.id],
            memberList: [],
            creator: [data.github.id],
        })
        //找到默认群Id
        let defaultGroup = await Group.findFirst()
        //查询user，有就更新，没有user就要创建
        let isUserExist = await userModel.findOne({user_id:data.github.id})
        if(isUserExist){
            //如果用户存在
            await this.update({
                user_id: data.github.id,
            },{
                user_id: data.github.id,
                github:data.github,
            })
        }else{
            console.log('not exist');
            //如果用户不存在，创建用户
            console.log('create user');
            await userModel.create({
                user_id: data.github.id.toString(),
                github: data.github,
                groups: [defaultGroup._id.toString()]
            });
            //加入default group
            console.log('join default group');
            await Group.join_member({
                group_id: defaultGroup._id.toString(),
                user_id: data.github.id.toString()
            })
        }
    }
    create(data){
        return userModel.insert(data);
    }
}

module.exports = new User();