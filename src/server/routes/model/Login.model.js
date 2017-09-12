const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const LoginSchema = new Schema({
	userName:String,
	passWord:String,
	avatorUrl:String
});

module.exports = mongoose.model("login",LoginSchema);