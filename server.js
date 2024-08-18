const flash = require('express-flash')
const express = require('express')
const fileUpload = require('express-fileupload');
const db = require('./database/db')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const AuthMiddleware = require('./middleware/AuthMiddleware')
const port = 3000
const appRoutes = require('./routes/web')

app.use(fileUpload());

app.set('view engine', 'ejs')
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    }))
}
app.use(flash());
app.use(cookieParser());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.get('*',AuthMiddleware.getInfoUser)
app.use(express.static('public'))
app.use(appRoutes)
app.use(function (req, res) {
    res.status(404).render('pages/404')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})