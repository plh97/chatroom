const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RoomSchema = new Schema({
	name: { type: String, default: 'Moonlight' },
	avatorUrl: { type: String, default: '' },
	administratorList:{ type: Array, default: [] },
	memberList:{ type: Array, default: [] },
    createTime: { type: Date, default: Date.now, index: true },
	creator: { type: String, default: '' },
	messageList: { type: Array, default: [] }
});

module.exports = mongoose.model("room",RoomSchema);