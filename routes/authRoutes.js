const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route pour configurer un compte
router.post('/setup-account', (req, res, next) => {
    console.log('Setup Account Route Hit');
    next();
}, authController.setupAccount);

// Route pour se connecter
router.post('/login', (req, res, next) => {
    console.log('Login Route Hit');
    next();
}, authController.login);

module.exports = router;