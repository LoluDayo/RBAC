const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


exports.register = (req, res) => {
    console.log(req.body);

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

        db.query('INSERT INTO users SET ?', { name: name, username: username, password: password, role: role }, (error, results) => {
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


}

exports.login = async(req, res) => {


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

                //req.session.isAuth == 1
                return res.render('dashboard', {
                    message: 'welcome to dashbord'
                })

            }
            //console.log(req.session.userRole);

        })

    } catch (error) {
        console.log(error)
    }

}

exports.users = (req, res) => {
    db.query('SELECT * FROM users ', (error, results) => {
        if (error) {
            console.log(error);

        } else {
            return res.render('users', {
                results
            })
        }

    })
}

exports.articles = (req, res) => {

    db.query('SELECT * FROM articles ', (error, rows) => {
        if (error) {
            console.log(error);

        } else {

            return res.render('articles', {
                Author: req.session.isAuth,
                Role: req.session.isRole,
                rows
            })

        }

    })


}

exports.posts = (req, res) => {
    db.query('SELECT * FROM articles ', (error, results) => {
        if (error) {
            console.log(error);

        } else {
            return res.render('index', {
                results: results
            })
        }


    })
}

exports.redirectLogin = (req, res, next) => {
    if (!req.session.isAuth) {
        res.redirect('/login')

    } else {
        next()
    }
}

exports.redirectHome = (req, res, next) => {

    if (req.session.isAuth) {
        res.redirect('/')

    } else {
        next()
    }
}

exports.authRole = function(role1, role2) {
    return (req, res, next) => {
        if (req.session.isRole !== (role1 || role2)) {
            res.status(401)
            return res.redirect('/dashboard', {
                message: 'forbidden'
            })
        }
        next()
    }

}