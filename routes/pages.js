const express = require("express");
const authC = require('../controllers/auth');
const router = express.Router();
const mysql = require("mysql");
const session = require("express-session");
const { handlebars } = require("hbs");
const { options } = require("./auth");

const MySQLStore = require('express-mysql-session')(session);



const app = express();


const db = mysql.createConnection({
     host: process.env.DATABASE_HOST,
     user: process.env.DATABASE_USER,
     password: process.env.DATABASE_PASSWORD,
     database: process.env.DATABASE
});

const sessionStore = new MySQLStore({},db);
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





router.get('/', authC.redirectLogin, (req, res) => {
    res.render('index')
});


router.get("/login", authC.redirectHome, (req, res) => {
    res.render("login")
});

router.get('/addUser',authC.redirectLogin, authC.authRole('Admin'), (req, res) => {
    res.render('addUser')
});

router.get('/addArticle',authC.redirectLogin, authC.authRole('Admin' || 'Editor'), (req, res) => {
    res.render('addArticle')
});

router.get('/users', authC.redirectLogin, authC.authRole('Admin'), authC.users,(req, res) => {
    res.render('users')
});

router.get('/dashboard', authC.redirectLogin,(req, res,) => {
    const {id} = req.body;
    db.query('SELECT * FROM users WHERE id =? ',[req.session.isAuth], (error, results) => {
        if(error) {
            console.log(error);
        
        } else {
            return res.render('dashboard', {
                results
            })
        }
         
    })
    
    
});



module.exports = router;