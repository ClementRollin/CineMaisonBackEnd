const db = require('../config/dbConfig');
const bcrypt = require('bcrypt');
const {post} = require("axios");

post('/register', async (req, res) => {
    try {
        const result = await db.execute(
            `INSERT INTO users (username, hashed_password) VALUES (?, ?)`,
            [username, hashedPassword]
        );
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
});

exports.findUserByUsername = async (username) => {
    try {
        const [rows] = await db.query(`SELECT * FROM users WHERE username = ?`, [username]);
        if (rows) {
            return rows;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error finding user by username:', error);
        throw error;
    }
};

post('/register', async (req, res) => {
    try {
        if (!password || !username) {
            throw new Error('Username and password are required');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        return await exports.createUser(username, hashedPassword);
    } catch (error) {
        console.error('Error setting up account:', error);
        throw error;
    }
});

post('/login', async (req, res) => {
    try {
        if (!password || !username) {
            throw new Error('Username and password are required');
        }
        const user = await exports.findUserByUsername(username);
        if (user) {
            const match = await bcrypt.compare(password, user.hashed_password);
            return match ? user : null;
        }
        return null;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
});