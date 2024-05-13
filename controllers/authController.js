const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.setupAccount = async (req, res) => {
    const { username, password, passwordConfirm } = req.body;
    if (!username || !password || !passwordConfirm) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }
    if (password !== passwordConfirm) {
        return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
    }

    try {
        await userModel.setupAccount(username, password);
        res.status(201).json({ message: "Compte créé avec succès." });
    } catch (error) {
        console.error('Error during account setup:', error);
        res.status(500).json({ message: "Erreur lors de la création du compte.", error: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis." });
    }
    
    try {
        console.log('Login attempt with username:', username);
        const user = await userModel.login(username, password);
        console.log('Login result user:', user);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé ou mot de passe incorrect." });
        }

        // Utilisation de la clé secrète JWT à partir des variables d'environnement
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        console.log('Token generated:', token);
        res.json({ message: "Connexion réussie.", token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: "Erreur lors de la connexion.", error: error.message });
    }
};