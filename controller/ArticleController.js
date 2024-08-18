const jwt = require('jsonwebtoken');
const ArticleModal = require('../model/Article')
const UserModal = require('../model/User')
const CommentaireModel = require('../model/Commentaire')

const getUser = function (req, res) {
    if (req.cookies.user){
        jwt.verify(req.cookies.user, 'secret', function(err, decoded) {
            UserModal.findById(decoded.data)
                .then(user =>{
                    return user
                })
                .catch(err => {
                    console.log(err)
                })
        });
    }
}
function showFormCreateArticle(req,res) {
    res.render('pages/article/create')
}
function createArticle(req,res) {

    if (req.cookies.user){
        jwt.verify(req.cookies.user, 'secret', function(err, decoded) {
            UserModal.findById(decoded.data)
                .then(user =>{
                    let nameFile=Date.now()+req.files.image.name
                    uploadPath='./public/imageArticles/'+nameFile

                    req.files.image.mv(uploadPath,function (err) {
                        if(err){
                            return res.redirect('/article/create');
                        }else {
                            let newArticle = new ArticleModal({
                                name: req.body.articlename,
                                image: nameFile,
                                desc:  req.body.message,
                                user: user
                            }) ;

                            newArticle.save();
                            req.flash('succes',true)
                            return res.redirect('/article/create');
                        }
                    });
                })
                .catch(err => {
                    console.log(err)
                })
        });
    }
}
function getArticle(req,res) {
    ArticleModal.findById(req.params.id)
        .then((article)=>{
            CommentaireModel.find({article:req.params.id})
                .then(comment =>{
                    res.render('pages/article/detail',{article: article, commentaires:comment})
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
        })
}
function commentArticle(req,res) {
    if (req.cookies.user){
        jwt.verify(req.cookies.user, 'secret', function(err, decoded) {
            UserModal.findById(decoded.data)
                .then( user =>{
                  let comment = new  CommentaireModel({
                      comment: req.body.comment.trim(),
                      user: user,
                      article: req.params.id
                  })
                    comment.save()
                    return res.redirect('/article/'+req.params.id)
                })
                .catch(err => {
                    console.log(err)
                })
        });
    }
}
function searchArticle(req , res) {
    const options ={
        name: new RegExp(req.query.search, 'i')
    }
    ArticleModal.paginate(options)
        .then(articles => {
            return res.render('pages/article/search',{articles:articles})
        })
        .catch(err => {
            console.log(err)
        })
}
module.exports={
    showFormCreateArticle,
    createArticle,
    getArticle,
    commentArticle,
    searchArticle
}