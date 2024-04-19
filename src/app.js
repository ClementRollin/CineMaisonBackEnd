const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const fetchAndStoreMovies = require('./services/tmdbService');
const moviesRoutes = require('./routes/moviesRoutes');
const usersRoutes = require('./routes/usersRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');

// Middlewares
app.use(express.json());
const cors = require('cors');
app.use(cors());

// Middleware pour logger les requêtes
const morgan = require('morgan');
app.use(morgan('dev'));

app.use('/api/movies', moviesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/favorites', favoritesRoutes);

// Gestionnaire d'erreurs centralisé
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Point d'entrée pour l'API
app.get('/', (req, res) => {
  res.send('Welcome to the CineMaison API!');
});

// Fonction pour fetcher et stocker les films au démarrage du serveur
fetchAndStoreMovies().then(() => {
  console.log("Movies fetched and stored successfully.");
}).catch(error => {
  console.error("Failed to fetch and store movies:", error);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;