const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const GroupSchema = new Schema({
	name: { type: String, default: 'Moonlight' },
	avatar_url: { type: String, default: 'https://assets.suisuijiang.com/group_avatar_default.jpeg?imageView2/2/w/40/h/40' },
	creator: { type: String, default: '' },
	memberList: { type: Array, default: [] },
	administratorList: { type: Array, default: [] },
	messageList: [{
		//必填，根据id查询用户信息
		id: { type: String, default: '' },
		type: { type: String, default: '' },
		//3选1
		text: { type: String, default: '' },
		code: { type: String, default: '' },
		image: { type: Object, default: {} },
		//不用填
		create_time: { type: String, default: Date.now  },
		update_time: { type: Date, default: new Date , index: true },
		_id: { type: Schema.Types.ObjectId, default: mongoose.Types.ObjectId },
		//改成空
		name: { type: String, default: '' },
		avatar_url: { type: String, default: '' },
	}],
	create_time: { type: Date, default: Date.now, index: true },
	update_time: { type: Date, default: Date.now, index: true },
});

const groupModel = mongoose.model('groups', GroupSchema);
const User = require('./User.model')

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
	async findFirst() {
		let firstGroup = (await groupModel.find({}))[0]
		return firstGroup
	}
	async sendMsg(data) {
		let msg = Object.assign({}, data, {
			name: '',
			avatar_url: ''
		})
		//更新 group.messageList
		await groupModel.findByIdAndUpdate(
			msg.group_id,
			{
				$push: {
					'messageList': msg
				}
			}
		);
		return msg
	}
}

module.exports = new Group();