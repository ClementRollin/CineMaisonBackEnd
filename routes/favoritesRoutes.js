const express = require('express');
const router = express.Router();

// Get all favorites
router.get('/favoris', async (req, res) => {
    res.send('Liste des films favoris');
});

// Create a new favorite
router.post('/', async (req, res) => {
    const newFavorite = await createFavorite(req.body);
    res.json(newFavorite);
});

// Update a favorite
router.put('/:id', async (req, res) => {
    const updatedFavorite = await updateFavorite(req.params.id, req.body);
    res.json(updatedFavorite);
});

// Delete a favorite
router.delete('/:id', async (req, res) => {
    const deletedFavorite = await deleteFavorite(req.params.id);
    res.json(deletedFavorite);
});

module.exports = router;