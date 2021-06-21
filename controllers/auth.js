const bcrypt = require("bcryptjs");
const mysql = require("mysql");
const AccessControl = require("accesscontrol")
// var usersRole;

// let grantArray = [
//     { role: 'BASIC', resource: 'index', action: 'read:any', attributes: '*, !id' },
//     { role: 'ADMIN', resource: ('index','register'), action: 'read:any', attributes: '*' },
//     { role: 'writer', resource: 'post', action: 'create:own', attributes: '*' },
//     { role: 'writer', resource: 'post', action: 'update:own', attributes: '*' },
//     { role: 'writer', resource: 'post', action: 'delete:own', attributes: '*' },
//     { role: 'EDITOR', resource: 'index', action: 'read:any', attributes: '*' },
//     { role: 'editor', resource: 'post', action: 'create:any', attributes: '*' },
//     { role: 'editor', resource: 'post', action: 'update:any', attributes: '*' },
//     { role: 'editor', resource: 'post', action: 'delete:any', attributes: '*' },
//   ]
  
//   const ac = new AccessControl(grantArray);

const db = mysql.createConnection({
     host: process.env.DATABASE_HOST,
     user: process.env.DATABASE_USER,
     password: process.env.DATABASE_PASSWORD,
     database: process.env.DATABASE
 });

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
        const { ac } = req.grantArray;
        
        if( !username || !password ) {
            return res.status(400).render('login', {
                message: 'please provide a username or password'
            });
        }

        db.query('SELECT * FROM users WHERE username =?', [username], async (error, results) => {
            if( ac.role == results[0].role) {
                console.log(ac.action)
            }
            //usersRole = results[0].role
            // console.log(usersRole);
            //     function userRole(req, res) {
            //     if(usersRole == null) {
            //         return res.render('login', {
            //             message: 'You Need to Login' 
            //         })
            //     }
            //}

            console.log(results);
            if( !results || !(password == results[0].password)) {
                res.status(401).render('login', {
                    message: 'Username or Password is incorrect'
                })
            } else {
                return res.render('dashboard', {
                    message: 'welcome to dashbord'
                })
            }
            
        })
    } catch (error) {
        console.log(error)
    } 

}

// exports.userRole = async (req, res) => {
//     console.log(usersRole);
//     if(usersRole == null) {
//         return res.render('login', {
//             message: 'You Need to Login' 
//         })
//     }
// }

// exports.login(exports.userRole);
 