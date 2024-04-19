const fetch = require('node-fetch');
const Movie = require('../models/movieModel');
require('dotenv').config();

async function fetchAndStoreMovies() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`);
        const data = await response.json();
        data.results.forEach(async movie => {
            await Movie.insert({
                title: movie.title,
                synopsis: movie.overview,
                cast: JSON.stringify(movie.cast),
                trailer_link: movie.trailer_link,
                streaming_platforms: JSON.stringify(movie.streaming_platforms),
                genres: movie.genre_ids.join(','),
                duration: movie.runtime
            });
        });
    } catch (err) {
        console.error('Failed to fetch and store movies:', err);
    }
}

module.exports = fetchAndStoreMovies;