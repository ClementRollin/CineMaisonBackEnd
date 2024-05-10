const Favorite = require('../models/favoriteModel');

exports.getAllFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.fetchAll();
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des favoris.", error: error.message });
    }
};

exports.createFavorite = async (req, res) => {
    const { user_id, movie_id } = req.body;
    try {
        await Favorite.insert({ user_id, movie_id });
        res.status(201).json({ message: "Favori ajouté avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du favori.", error: error.message });
    }
};

exports.updateFavorite = async (req, res) => {
    const { id } = req.params;
    const { user_id, movie_id } = req.body;
    try {
        await Favorite.update(id, { user_id, movie_id });
        res.json({ message: "Favori mis à jour avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du favori.", error: error.message });
    }
};

exports.deleteFavorite = async (req, res) => {
    const { id } = req.params;
    try {
        await Favorite.delete(id);
        res.json({ message: "Favori supprimé avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du favori.", error: error.message });
    }
};