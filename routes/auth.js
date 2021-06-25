
const express = require('express');
const authC = require('../controllers/auth'); 
const router = express.Router();
const mysql = require("mysql");
const session = require("express-session");

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



router.post('/login',  (req, res) => {
    console.log(req.session)
    try{    
        const { username, password } = req.body;
        
        if( !username || !password ) {
            return res.status(400).render('login', {
                message: 'please provide a username or password'
            });
        }
        
        db.query('SELECT * FROM users WHERE username =?', [username], async (error, results) => {
                

            //console.log(results);
            if( !results || !(password == results[0].password)) {
                res.status(401).render('login', {
                    message: 'Username or Password is incorrect'
                })
            } else {
                
                req.session.isAuth = results[0].id;
                req.session.isRole = results[0].role;
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

router.post('/addUser', authC.register);


router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            return res.redirect('/')
        }
        res.clearCookie()
        res.redirect('/login')
    })

})

module.exports = router;