const express = require('express');
const router = express.Router();

router.get('/movies', async (req, res) => {
    res.send('Liste de films');
});

module.exports = router;