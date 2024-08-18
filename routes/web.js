const express = require('express')
const router = express.Router()
const AuthController = require('../controller/AuthController');
const HomeController = require('../controller/HomeController');
const AuthMiddeware = require('../middleware/AuthMiddleware');
const ArticleController = require('../controller/ArticleController');


router.get('/login', AuthController.showFormLogin)
router.post('/login', AuthController.login)

router.get('/register', AuthController.showFormRegister)
router.post('/register', AuthController.register)

router.get('/article/create', AuthMiddeware.isAuthenticated,ArticleController.showFormCreateArticle)
router.post('/article/create', AuthMiddeware.isAuthenticated,ArticleController.createArticle)

router.get('/article/search', AuthMiddeware.isAuthenticated,ArticleController.searchArticle)

router.get('/article/:id', AuthMiddeware.isAuthenticated,ArticleController.getArticle)
router.post('/article/:id/comment', AuthMiddeware.isAuthenticated,ArticleController.commentArticle)

router.get('/',AuthMiddeware.isAuthenticated,HomeController.showHome)

router.get('/logout',AuthMiddeware.isAuthenticated,AuthController.logout)

module.exports = router