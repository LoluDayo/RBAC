const express = require("express");
const authC = require('../controllers/auth');
const router = express.Router();
const mysql = require("mysql");
const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const sessionStore = new MySQLStore({}, db);
router.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'itsasecret',
    store: sessionStore,
    cookie: {
        maxAge: 2880000,
        sameSite: true,

    }
}))

router.get('/', authC.redirectLogin, authC.posts, (req, res) => {
    res.render("index")
});


router.get("/login", authC.redirectHome, (req, res) => {
    res.render("login")
});

router.get('/addUser', authC.redirectLogin, authC.authRole('Admin'), (req, res) => {
    res.render('addUser')
});

router.get('/addArticle', authC.redirectLogin, (req, res) => {
    res.render('addArticle')
});

router.get('/users', authC.redirectLogin, authC.authRole('Admin'), authC.users, (req, res) => {
    res.render('users')
});

router.get('/articles', authC.redirectLogin, authC.articles, authC.authRole('Admin', 'Editor'), (req, res) => {
    res.render('articles')
});


router.get('/dashboard',  (req, res, ) => {

    db.query('SELECT * FROM users WHERE usrId =? ', [req.session.isAuth], (error, results) => {
        if (error) {
            console.log(error);

        } else {
            return res.render('dashboard', {
                results
            })
        }

    })


});



module.exports = router;