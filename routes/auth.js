
const express = require('express');
const authController = require('../controllers/auth'); 
const router = express.Router();


router.post('/login',  authController.login /*, (req, res) => {
    //req.session.userRole == results[0].role

}*/);  

router.post('/register', authController.register);

// router.get('/users', authController.users);

module.exports = router;