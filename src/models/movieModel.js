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
            const sql = "INSERT INTO Movies (title, synopsis, cast, trailer_link, streaming_platforms, genres, duration) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const res = await conn.query(sql, [movie.title, movie.synopsis, movie.cast, movie.trailer_link, movie.streaming_platforms, movie.genres, movie.duration]);
            return res;
        } finally {
            if (conn) await conn.release();
        }
    }
}

module.exports = Movie;