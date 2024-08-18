const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const articleShema = new Schema({
    name: { type: String },
    image: { type: String },
    desc: { type: String },
    user: {type: Object},
},{timestamps: true});

articleShema.plugin(mongoosePaginate);

const ArticleModel = mongoose.model('articles', articleShema);

module.exports =  ArticleModel;