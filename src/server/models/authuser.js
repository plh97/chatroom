// const mongoose = require('./db.js');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const authUserSchema = new Schema({
    login: String,
    name: String,
    avatar_url: String,
});

const authUserModel = mongoose.model('authuser', authUserSchema);

module.exports = authUserModel;