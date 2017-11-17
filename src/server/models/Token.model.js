const User = require('./User.model');
const Group = require('./Group.model');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tokenSchema = new Schema({
    access_token: { type: String, default: '' },
    _id: { type: String, default: '' }
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
            _id:data._id
        });
        if(isExist.length){
            await tokenModel.update({
                _id:data._id
            }, data).exec();
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
                _id:me._id
            })
            myInfo.groups = await Promise.all(myInfo.groups.map( async id =>{
                let groupInfo = await Group.findOne({
                    _id:id
                })
                return {
                    name:groupInfo.name,
                    avatar_url:groupInfo.avatar_url
                }
            }))
            return await myInfo
        }
    }
}

module.exports = new Token();