const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const StudentSchema = new Schema({
	name:String,
	age:String,
	sex:String,
	address:String,
	email:String,
	moneny:String
});

module.exports = mongoose.model("students",StudentSchema);