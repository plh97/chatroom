const User = require('./User.model');
const Group = require('./Group.model');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tokenSchema = new Schema({
    access_token: { type: String, default: '' },
    user_id: { type: String, default: '' }
});
const tokenModel = mongoose.model('tokens', tokenSchema);

class Token {
	find(data) {
		return tokenModel.find(data)
	}
	findOne(data) {
		return tokenModel.findOne(data)
	}
    async save(data){
        //根据id查找数据库,如果存在update，不存在save 
        let isExist = await tokenModel.find({
            user_id:data.user_id
        });
        if(isExist.length){
            await tokenModel.update({
                user_id:data.user_id
            }, data);
        }else{
            await tokenModel(data).save();
        }
    }

    /*
    *   @param {string}     access_token
    *   @return {Object}    myInfo
    *   1)验证token，将token在token数据库查询一次
    *       一.能找到，则token正确。
    *           1.能找到，则token正确。
    *           2.根据token查找id。
    *           3.根据id查找userInfo。
    *           3.将groups 里面的id 替换成 {name:...,avatar_url:...}。
    *       二.不能找到，则token不正确。
    */
    async verify(data){
        let me = await this.findOne({
            access_token:data
        })
        //如果能找到我的token，说明我的token验证通过
        if(me){
            let myInfo = await User.findOne({
                user_id:me.user_id
            })
            //因为User.group里面的类型被写死了，所以只能重新命名newmyinfo
            let newMyInfo = {
                user_id:myInfo.user_id,
                groups:myInfo.groups,
                friends:myInfo.friends,
                github:myInfo.github
            };
            newMyInfo.groups = await Promise.all(myInfo.groups.map( async _id =>{
                let groupInfo = await Group.findOne({_id})
                return {
                    group_name:groupInfo.group_name,
                    group_id:groupInfo._id,
                    avatar_url:groupInfo.avatar_url
                } 
            }))
            return newMyInfo
        }
    }
}

module.exports = new Token();