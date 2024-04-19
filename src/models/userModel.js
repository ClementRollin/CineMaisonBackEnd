const db = require('../config/dbConfig');

exports.createUser = async (username, hashedPassword) => {
    const [result] = await db.execute(
        `INSERT INTO users (username, hashed_password) VALUES (?, ?)`,
        [username, hashedPassword]
    );
    return result;
};

exports.findUserByUsername = async (username) => {
    const [rows] = await db.query(`SELECT * FROM users WHERE username = ?`, [username]);
    return rows[0];
};