const express = require("express")
const path = require('path')
const mysql = require("mysql")
const dotenv = require('dotenv');

dotenv.config({ path: './.env'});

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

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



app.listen(5000, () => {
    console.log("server started on port 5000"); 
})