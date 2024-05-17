const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Route pour la création d'un compte
exports.register = async (req, res) => {
    const { username, password, passwordConfirm } = req.body;
    if (!username || !password || !passwordConfirm) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }
    if (password !== passwordConfirm) {
        return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.createUser(username, hashedPassword);
        res.status(201).json({ message: "Compte créé avec succès." });
    } catch (error) {
        console.error('Error during account setup:', error);
        res.status(500).json({ message: "Erreur lors de la création du compte.", error: error.message });
    }
};

// Route pour la connexion
exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis." });
    }

    try {
        const user = await userModel.findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const match = await bcrypt.compare(password, user.hashed_password);
        if (!match) {
            return res.status(400).json({ message: "Mot de passe incorrect." });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ message: "Connexion réussie.", token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: "Erreur lors de la connexion.", error: error.message });
    }
};