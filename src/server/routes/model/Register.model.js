const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RegisterSchema = new Schema({
	userName:String,
	passWord:String,
	avatorUrl:String
});

module.exports = mongoose.model("register",RegisterSchema);