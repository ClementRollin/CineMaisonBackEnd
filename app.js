const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const moviesRoutes = require('./routes/moviesRoutes');
const usersRoutes = require('./routes/usersRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const bodyParser = require('body-parser');
const authController = require('./controllers/authController');
require('dotenv').config();

// Initialiser l'application
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(bodyParser.json());

// Limiteur de taux
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limite chaque IP à 100 requêtes par fenêtre de 15 minutes
});
app.use(limiter);

app.use('/auth', authRoutes);
app.use('/movies', moviesRoutes);
app.use('/users', usersRoutes);
app.use('/favorites', favoritesRoutes);

app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;