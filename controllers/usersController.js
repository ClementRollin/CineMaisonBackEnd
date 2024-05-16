const userModel = require('../models/userModel');
const { post} = require("../app");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.fetchAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs.", error: error.message });
    }
};

post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.createUser(username, hashedPassword);
        res.status(201).json({ message: "Utilisateur créé avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l'utilisateur.", error: error.message });
    }
});

post('/login', async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    try {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
        await userModel.updateUser(id, { username, hashedPassword });
        res.json({ message: "Utilisateur mis à jour avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur.", error: error.message });
    }
});

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await userModel.deleteUser(id);
        res.json({ message: "Utilisateur supprimé avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur.", error: error.message });
    }
};