const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentaireShema = new Schema({
    comment: { type: String },
    user: {type: Object},
    article: { type: String },
},{timestamps: true});

const CommentaireModel = mongoose.model('commentaires', commentaireShema);

module.exports =   CommentaireModel;