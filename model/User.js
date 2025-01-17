const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userShema = new Schema({
    name: { type: String },
    mail: { type: String },
    password: { type: String },
},{timestamps: true});

const UserModel = mongoose.model('users', userShema);

module.exports =  UserModel;