const bcrypt = require("bcryptjs");
const mysql = require("mysql");
const session = require("express-session")
const express = require("express")
const dotenv = require('dotenv');
dotenv.config({ path: '../.env'});

const app = express();


const db = mysql.createConnection({
     host: process.env.DATABASE_HOST,
     user: process.env.DATABASE_USER,
     password: process.env.DATABASE_PASSWORD,
     database: process.env.DATABASE
 });


 app.use(session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: process.env.SESS_LIFETIME,
        sameSite: true,
        secure: process.env.IN_PROD
    }
}))

exports.register = (req, res) => {
    console.log(req.body);

    const { name, username, password, role} = req.body;

    db.query('SELECt username FROM users WHERE username = ?', [username],(error, results) => {
        if(error) {
            console.log(error);
        }

        if( results.length > 0) {
            return res.render('register',{
                message: 'Username ia already in use'
            });
        }
        db.query('INSERT INTO users SET ?', {name: name, username: username, password: password, role: role}, (error, results) =>{
            if(error) {
                console.log(error);
            } else {
                console.log(results)
                return res.render('register',{
                    message: 'User Created'
                })
            }
        })
    })
    
    
}
exports.login = async (req, res) => {
    try {
        const {username, password } = req.body;

        
        if( !username || !password ) {
            return res.status(400).render('login', {
                message: 'please provide a username or password'
            });
        }

        db.query('SELECT * FROM users WHERE username =?', [username], async (error, results) => {
            

            console.log(results);
            if( !results || !(password == results[0].password)) {
                res.status(401).render('login', {
                    message: 'Username or Password is incorrect'
                })
            } else {
                req.session.userRole = results[0].role
                return res.render('dashboard', {
                    message: 'welcome to dashbord'
                })
            }
            
        })
    } catch (error) {
        console.log(error)
    } 

}

exports.users = async (req, res) => {
    db.query('SELECT * FROM users ', async (error, results) => {
        if(error) {
            console.log(error);
        
        } else {
            return res.render('users', {
                results
            })
        }
        console.log(results) 
    })
}


 