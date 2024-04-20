require('dotenv').config();
const axios = require('axios');
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    connectionLimit: 5
});

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const MAX_MOVIES = 1000;

async function fetchMovieDetails(movieId) {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'en-US'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch details for movie ${movieId} from TMDB:`, error.message);
        return null;
    }
}

async function fetchMovies(page = 1) {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'en-US',
                page: page
            }
        });
        return { movies: response.data.results, totalPages: response.data.total_pages, currentPage: page };
    } catch (error) {
        console.error('Failed to fetch movies from TMDB:', error.message);
        return { movies: [], totalPages: 0, currentPage: page };
    }
}

async function saveMovies(movies) {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const queryPromises = movies.map(async movie => {
            const movieDetails = await fetchMovieDetails(movie.id);
            if (!movieDetails) return;

            const genres = (movieDetails.genres && Array.isArray(movieDetails.genres)) ? movieDetails.genres.map(g => g.name).join(', ') : 'N/A';
            const productionCompanies = (movie.production_companies && Array.isArray(movie.production_companies))
                ? JSON.stringify(movie.production_companies.map(pc => pc.name || 'N/A'))
                : '[]';
            const productionCountries = (movie.production_countries && Array.isArray(movie.production_countries))
                ? JSON.stringify(movie.production_countries.map(pc => pc.name || 'N/A'))
                : '[]';
            const spokenLanguages = (movie.spoken_languages && Array.isArray(movie.spoken_languages))
                ? JSON.stringify(movie.spoken_languages.map(lang => lang.english_name || 'N/A'))
                : '[]';

            const sql = `
                INSERT INTO Movies (movie_id, title, original_title, overview, tagline, release_date, genres,
                                    original_language, status, runtime, popularity, budget, revenue, adult,
                                    video, backdrop_path, poster_path, homepage, imdb_id, production_companies,
                                    production_countries, spoken_languages)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE title=VALUES(title), overview=VALUES(overview), genres=VALUES(genres), runtime=VALUES(runtime);
            `;
            return conn.query(sql, [
                movie.id, movie.title, movie.original_title, movie.overview, movie.tagline, movie.release_date,
                genres, movie.original_language, movie.status, movie.runtime, movie.popularity, movie.budget,
                movie.revenue, movie.adult, movie.video, movie.backdrop_path, movie.poster_path, movie.homepage,
                movie.imdb_id, productionCompanies, productionCountries, spokenLanguages
            ]);
        });
        await Promise.all(queryPromises);
        await conn.commit();
        console.log('Movies have been successfully saved to the database.');
    } catch (error) {
        await conn.rollback();
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