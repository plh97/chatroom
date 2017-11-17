const User = require('./User.model');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const GroupSchema = new Schema({
	name: { type: String, default: 'Moonlight' },
	avatar_url: { type: String, default: 'https://assets.suisuijiang.com/group_avatar_default.jpeg?imageView2/2/w/40/h/40' },
	creator: { type: String, default: '' },
	memberList: { type: Array, default: [] },
	administratorList: { type: Array, default: [] },
	messageList: { type: Array, default: [] },
	createTime: { type: Date, default: Date.now, index: true },
	updateTime: { type: Date, default: Date.now, index: true },
});

const groupModel = mongoose.model('groups', GroupSchema);

class Group {
	//基础创建，可拓展。
	async create(data) {
		await groupModel(data).save()
	}
	find(data) {
		return groupModel.find(data)
	}
	findOne(data) {
		return groupModel.findOne(data)
	}
	async findFirst(){
		let firstGroup = (await groupModel.find({}))[0]
		return firstGroup
	}
}

module.exports = new Group();