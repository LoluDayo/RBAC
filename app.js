const express = require("express")
const handlebar = require("express-session")
const path = require('path')
const mysql = require("mysql")
const dotenv = require('dotenv');
const handlebars = require('hbs')


dotenv.config({ path: './.env'});

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

// app.use(session({
//     name: process.env.SESS_NAME,
//     resave: false,
//     saveUninitialized: false,
//     secret: process.env.SESS_SECRET,
//     cookie: {
//         maxAge: process.env.SESS_LIFETIME,
//         sameSite: true,
//         secure: process.env.IN_PROD
//     }
// }))

const publicdirectory = path.join(__dirname, './public');
app.use(express.static(publicdirectory));

// Parse URL-encoded bodies (as sent by html forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sentby API clients)
app.use(express.json());

app.set('view engine', 'hbs');
 
db.connect( (err) => {
    if(err) {
        console.log(err)
    } else {
        console.log("MYSQL Connected...")
    }
})

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

handlebars.registerHelper('ifCond', function(v1, v2, options) {
    
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
 
})

app.listen(5000, () => {
    console.log("server started on port 5000"); 
})