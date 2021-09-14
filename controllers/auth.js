const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

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