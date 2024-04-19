const pool = require('../config/dbConfig');

class Movie {
    static async fetchAll() {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT * FROM Movies");
            return rows;
        } finally {
            if (conn) await conn.release();
        }
    }

    static async insert(movie) {
        let conn;
        try {
            conn = await pool.getConnection();
            // Convertir les genres en une chaîne de noms séparés par des virgules
            const genres = movie.genres ? movie.genres.map(g => g.name).join(', ') : '';
            const sql = `
                INSERT INTO Movies (movie_id, title, original_title, overview, tagline, release_date, genres,
                                    original_language, status, runtime, popularity, budget, revenue, adult,
                                    video, backdrop_path, poster_path, homepage, imdb_id, production_companies,
                                    production_countries, spoken_languages)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE title = VALUES(title), overview = VALUES(overview), genres = VALUES(genres), runtime = VALUES(runtime);
            `;
            const res = await conn.query(sql, [
                movie.id, movie.title, movie.original_title, movie.overview, movie.tagline, movie.release_date,
                genres, movie.original_language, movie.status, movie.runtime, movie.popularity, movie.budget, 
                movie.revenue, movie.adult, movie.video, movie.backdrop_path, movie.poster_path, movie.homepage,
                movie.imdb_id, JSON.stringify(movie.production_companies), JSON.stringify(movie.production_countries),
                JSON.stringify(movie.spoken_languages.map(lang => lang.english_name))
            ]);
            return res;
        } finally {
            if (conn) await conn.release();
        }
    }
}

module.exports = Movie;