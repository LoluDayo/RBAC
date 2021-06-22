const express = require("express");
const authController = require('../controllers/auth');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index')
});


router.get("/login", (req, res) => {
    res.render("login")
});

router.get('/register', (req, res) => {
    res.render('register')
});

router.get('/users', authController.users, (req, res) => {
    res.render('users')
});

router.get('/dasboard', (req, res) => {
    
    res.render('dashboard')
});

module.exports = router;