const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.send('Liste de films');
});

module.exports = router;