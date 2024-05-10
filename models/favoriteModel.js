const pool = require('../config/dbConfig');

class Favorite {
    static async fetchAll() {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT * FROM Favorites");
            return rows;
        } finally {
            if (conn) await conn.release();
        }
    }

    static async insert(favorite) {
        let conn;
        try {
            conn = await pool.getConnection();
            const sql = `
                INSERT INTO Favorites (user_id, movie_id)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE movie_id = VALUES(movie_id);
            `;
            const res = await conn.query(sql, [favorite.user_id, favorite.movie_id]);
            return res;
        } finally {
            if (conn) await conn.release();
        }
    }

    static async update(id, newFavorite) {
        let conn;
        try {
            conn = await pool.getConnection();
            const sql = `
                UPDATE Favorites SET user_id = ?, movie_id = ?
                WHERE id = ?;
            `;
            const res = await conn.query(sql, [newFavorite.user_id, newFavorite.movie_id, id]);
            return res;
        } finally {
            if (conn) await conn.release();
        }
    }

    static async delete(id) {
        let conn;
        try {
            conn = await pool.getConnection();
            const sql = `
                DELETE FROM Favorites WHERE id = ?;
            `;
            const res = await conn.query(sql, [id]);
            return res;
        } finally {
            if (conn) await conn.release();
        }
    }
}

module.exports = Favorite;