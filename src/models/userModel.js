const db = require('../config/dbConfig');
const bcrypt = require('bcrypt');

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

exports.setupAccount = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await exports.createUser(username, hashedPassword);
};

exports.login = async (username, password) => {
    const user = await exports.findUserByUsername(username);
    if (user) {
        const match = await bcrypt.compare(password, user.hashed_password);
        return match ? user : null;
    }
    return null;
};