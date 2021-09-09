const express = require('express');
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



router.post('/login', (req, res) => {
   
    console.log(req.session)
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).render('login', {
                message: 'please provide a username or password'
            });
        }

        db.query('SELECT * FROM users WHERE username =?', [username], async(error, results) => {


            //console.log(results);
            if (!results || !(password == results[0].password)) {
                res.status(401).render('login', {
                    message: 'Username or Password is incorrect'
                })
            } else {

                req.session.isAuth = results[0].usrId;
                req.session.isRole = results[0].role;
                req.session.isName = results[0].name;
                return res.render('index', {
                    results,
                    message: 'welcome to dashbord'
                })

            }
            console.log(req.session.isAuth);

        })
    } catch (error) {
        console.log(error)
    }

})

router.post('/addArticle', (req, res) => {
    console.log(req.body);
    postId = randomString(3)
    console.log(postId)
    const { title, about, body, } = req.body;

    db.query('SELECt title FROM articles WHERE title = ?', [title], (error, results) => {

        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('addArticle', {
                message: 'Title is already in use'
            });
        }

        db.query('INSERT INTO articles SET ?', { authorName: req.session.isName, authorId: req.session.isAuth, about: about, title: title, body: body, articleId }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results)
                return res.render('addArticle', {
                    message: 'Article Posted'
                })
            }
        })
    })


})

router.post('/addUser', (req, res) => {
    console.log(req.body);
    usrId = randomString(3)
    console.log(usrId)
    const { name, username, password, role } = req.body;

    db.query('SELECt username FROM users WHERE username = ?', [username], (error, results) => {

        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('addUser', {
                message: 'Username is already in use'
            });
        }

        db.query('INSERT INTO users SET ?', { name: name, username: username, password: password, role: role, usrId: usrId }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results)
                return res.render('addUser', {
                    message: 'User Created'
                })
            }
        })
    })
})



router.get('/logout', (req, res) => {
    
    req.session.destroy(error => {
        if (error) {
            return res.redirect('/')
        }
        res.clearCookie()
        res.redirect('/login')
    })

})

function randomString(n) {
    charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var Str = '';
    for (var i = 0; i < n; i++) {
        var index = Math.floor(Math.random() * charSet.length);
        Str += charSet.substring(index, index+1);
    }
    return Str;
}
module.exports = router;