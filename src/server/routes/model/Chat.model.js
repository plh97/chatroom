const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChatSchema = new Schema({
	userName:String,
	time:String,
	avatorUrl: String,
	message:String,
	imageUrl: String
});

module.exports = mongoose.model("Chat",ChatSchema);