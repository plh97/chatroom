const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const LoginSchema = new Schema({
	userId: { type: String, default: "" },
	userName: { type: String, default: "" },
	passWord: { type: String, default: "" },
	avatorUrl: { type: String, default: "" },
	qq: { type: String, default: "" },
	github: { type: String, default: "" },
	website: { type: String, default: "" },
    createTime: { type: Date, default: Date.now, index: true },
	birthday: { type: String, default: "" },
});

module.exports = mongoose.model("login",LoginSchema);