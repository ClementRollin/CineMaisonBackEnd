const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route pour configurer un compte
router.post('/register', authController.register);

// Route pour se connecter
router.post('/login', authController.login);

module.exports = router;