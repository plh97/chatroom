const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChatSchema = new Schema({
	userName:String,
	time:String,
	message:String
});

module.exports = mongoose.model("Chat",ChatSchema);