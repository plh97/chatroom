const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RoomSchema = new Schema({
	roomName: { type: String, default: 'Moonlight' },
	roomAvatorUrl: { type: String, default: '' },
	administrator:{ type: Array, default: [] },
	members:{ type: Array, default: [] },
    createTime: { type: Date, default: Date.now, index: true },
	creator: { type: String, default: '' },
	messagesList: { type: Array, default: [] }
});

module.exports = mongoose.model("room",RoomSchema);