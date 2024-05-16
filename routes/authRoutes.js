const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route pour configurer un compte
router.post('/setup-account', (req, res, next) => {
    // Vérifier si les champs requis sont présents
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis." });
    }

    // validation
    if (!username || !password) {
        return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis." });
    }

    // Vérifier si l'utilisateur existe déjà
    const user = users.find(user => user.username === username);
    if (user) {
        return res.status(400).json({ message: "Nom d'utilisateur déjà utilisé." });
    }

    // Ajouter un nouvel utilisateur
    users.push({ username, password });
    res.status(201).json({ message: "Compte configuré avec succès." });
}, authController.setupAccount);

// Route pour se connecter
router.post('/login', (req, res, next) => {
    console.log('Login Route Hit');
    next();
}, authController.login);

module.exports = router;