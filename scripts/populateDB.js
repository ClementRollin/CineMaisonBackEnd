require('dotenv').config();
const axios = require('axios');
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const MAX_MOVIES = 1000;

async function fetchMovies(page = 1) {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'en-US',
                page: page
            }
        });
        const movies = response.data.results;
        const totalPages = response.data.total_pages;
        return { movies, totalPages, currentPage: page };
    } catch (error) {
        console.error('Failed to fetch movies from TMDB:', error);
        return { movies: [], totalPages: 0, currentPage: page };
    }
}

async function saveMovies(movies) {
    let conn;
    try {
        conn = await pool.getConnection();
        const queryPromises = movies.map(movie => {
            const genres = movie.genres ? movie.genres.map(g => g.name).join(', ') : '';
            const sql = `INSERT INTO Movies (
                tmdb_id, title, original_title, overview, genres, release_date, runtime, popularity, 
                vote_average, vote_count, budget, revenue, original_language, status, tagline, 
                poster_path, backdrop_path, homepage, imdb_id
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            ) ON DUPLICATE KEY UPDATE title=VALUES(title), overview=VALUES(overview)`;
            return conn.query(sql, [
                movie.id, movie.title, movie.original_title, movie.overview, genres, movie.release_date, movie.runtime,
                movie.popularity, movie.vote_average, movie.vote_count, movie.budget, movie.revenue, movie.original_language,
                movie.status, movie.tagline, movie.poster_path, movie.backdrop_path, movie.homepage, movie.imdb_id
            ]);
        });
        await Promise.all(queryPromises);
        console.log('Movies have been successfully saved to the database.');
    } catch (error) {
        console.error('Error saving movies to database:', error);
    } finally {
        if (conn) await conn.end();
    }
}

async function main() {
    let totalMoviesFetched = 0;
    let { movies, totalPages, currentPage } = await fetchMovies();
    while (currentPage <= totalPages && totalMoviesFetched < MAX_MOVIES) {
        await saveMovies(movies.slice(0, MAX_MOVIES - totalMoviesFetched));
        totalMoviesFetched += movies.length;
        if (totalMoviesFetched < MAX_MOVIES && currentPage < totalPages) {
            currentPage++;
            const results = await fetchMovies(currentPage);
            movies = results.movies;
        } else {
            break;
        }
    }
    console.log(`Total movies fetched and saved: ${totalMoviesFetched}`);
}

main();