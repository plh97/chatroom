const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChatSchema = new Schema({
	userId:{ type: String, default: '' },
    createTime: { type: String, default: new Date().toLocaleString() },
	text:{ type: String, default: "" },
	image: { type: Object, default: {} },
	code: { type: String, default: "" },
	type: { type: String, default: "text" }
});

module.exports = mongoose.model("Chat",ChatSchema);