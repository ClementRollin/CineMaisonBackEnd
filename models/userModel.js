const db = require('../config/dbConfig');

exports.createUser = async (username, hashedPassword) => {
    try {
        return await db.execute(
            `INSERT INTO users (username, hashed_password) VALUES (?, ?)`,
            [username, hashedPassword]
        );
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

exports.findUserByUsername = async (username) => {
    try {
        const [rows] = await db.execute(`SELECT * FROM users WHERE username = ?`, [username]);
        return rows[0];
    } catch (error) {
        console.error('Error finding user by username:', error);
        throw error;
    }
};