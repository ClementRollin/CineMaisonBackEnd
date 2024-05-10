const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.setupAccount = async (req, res) => {
    const { username, password, passwordConfirm } = req.body;
    if (password !== passwordConfirm) {
        return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.createUser(username, hashedPassword);
        res.status(201).json({ message: "Compte créé avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du compte.", error: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userModel.findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const match = await bcrypt.compare(password, user.hashed_password);
        if (match) {
            const token = jwt.sign({ userId: user.id }, 'votre_secret_jwt', { expiresIn: '24h' });
            res.json({ message: "Connexion réussie.", token });
        } else {
            res.status(401).json({ message: "Mot de passe incorrect." });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la connexion.", error: error.message });
    }
};