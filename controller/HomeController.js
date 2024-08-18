const ArticleModal = require('../model/Article');7
const moment = require('moment');
moment.locale('fr');
const showHome = (req,res) => {
    const options ={
        page: parseInt(req.query.page) || 1,
        limit: 3,
        sort: { createdAt: -1 }
    }
    ArticleModal.paginate({},options)
        .then(articles => {
            articles.docs.forEach(article => {
                article.formatter = moment(article.createdAt).fromNow();
            })
            res.render('pages/home',{articles:articles});
        })
        .catch(err => {
            console.log(err)
        })
}
module.exports={
    showHome
}