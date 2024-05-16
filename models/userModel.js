const db = require('../config/dbConfig');
const bcrypt = require('bcrypt');
const {post} = require("axios");

post('/register', async (req, res) => {
    try {
        let username = req.body.username;
        let hashedPassword = await bcrypt.hash(req.body.password, 10);

        return await db.execute(
            `INSERT INTO users (username, hashed_password) VALUES (?, ?)`,
            [username, hashedPassword]
        );
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
});

post('/register', async (req, res) => {
    try {
        let password = req.body.password;
        let username = req.body.username;

        if (!password || !username) {
            return new Error('Username and password are required');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        return await db.execute(
            `INSERT INTO users (username, hashed_password) VALUES (?, ?)`,
            [username, hashedPassword]
        );
    } catch (error) {
        console.error('Error setting up account:', error);
        throw error;
    }
});

post('/login', async (req, res) => {
    try {
        let password = req.body.password;
        let username = req.body.username;

        if (!password || !username) {
            return new Error('Username and password are required');
        }
        const user = await exports.findUserByUsername(username);
        user.hashed_password = user.hashed_password.toString();
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