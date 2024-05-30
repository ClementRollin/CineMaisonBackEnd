const Movie = require('../models/movieModel');

exports.getMovies = async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    try {
        const offset = (page - 1) * limit;
        const movies = await Movie.find().skip(offset).limit(parseInt(limit));
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des films.", error: error.message });
    }
};

exports.createMovie = async (req, res) => {
    const movie = req.body;
    try {
        await Movie.insert(movie);
        res.status(201).json({ message: "Film ajouté avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du film.", error: error.message });
    }
};

exports.updateMovie = async (req, res) => {
    const { id } = req.params;
    const movie = req.body;
    try {
        await Movie.update(id, movie);
        res.json({ message: "Film mis à jour avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du film.", error: error.message });
    }
};

exports.deleteMovie = async (req, res) => {
    const { id } = req.params;
    try {
        await Movie.delete(id);
        res.json({ message: "Film supprimé avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du film.", error: error.message });
    }
};