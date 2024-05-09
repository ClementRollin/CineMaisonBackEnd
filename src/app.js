const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Importation des services et des routes
const fetchAndStoreMovies = require('./services/tmdbService');
const moviesRoutes = require('./routes/moviesRoutes');
const usersRoutes = require('./routes/usersRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const authRoutes = require('./routes/authRoutes');

// Configuration des middlewares de base
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Limitation du taux de requêtes pour prévenir les attaques par force brute
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Routes
app.use('/routes', moviesRoutes);
app.use('/routes', usersRoutes);
app.use('/routes', favoritesRoutes);
app.use('/routes', authRoutes);

// Route d'accueil simple
app.get('/', (req, res) => {
  res.send('Welcome to the CineMaison API!');
});

// Gestion des erreurs centralisée
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Initialisation des données de films au démarrage
fetchAndStoreMovies().then(() => {
  console.log("Movies fetched and stored successfully.");
}).catch(error => {
  console.error("Failed to fetch and store movies:", error);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;