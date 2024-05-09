const express = require('express');
const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
    res.send('Liste des utilisateurs');
});

// Create a new user
router.post('/', async (req, res) => {
    const newUser = await createUser(req.body);
    res.json(newUser);
});

// Update a user
router.put('/:id', async (req, res) => {
    const updatedUser = await updateUser(req.params.id, req.body);
    res.json(updatedUser);
});

// Delete a user
router.delete('/:id', async (req, res) => {
    const deletedUser = await deleteUser(req.params.id);
    res.json(deletedUser);
});

module.exports = router;