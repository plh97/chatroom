const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RegisterSchema = new Schema({
	userName:String,
	passWord:String
});

module.exports = mongoose.model("register",RegisterSchema);