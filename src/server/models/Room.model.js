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

const roomModel = mongoose.model('rooms', RoomSchema);

class room {
    find(condition) {
        return roomModel.find(condition);
    }
    findOne(condition) {
        return roomModel.findOne(condition);
    }
}

module.exports = new room();