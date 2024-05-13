const db = require('../config/dbConfig');
const bcrypt = require('bcrypt');

exports.createUser = async (username, hashedPassword) => {
    try {
        const result = await db.execute(
            `INSERT INTO users (username, hashed_password) VALUES (?, ?)`,
            [username, hashedPassword]
        );
        console.log('User created:', result);
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

exports.findUserByUsername = async (username) => {
    try {
        console.log('Querying user by username:', username);
        const [rows] = await db.query(`SELECT * FROM users WHERE username = ?`, [username]);
        console.log('Query result:', rows);
        if (rows) {
            console.log('User found:', rows);
            return rows;
        } else {
            console.log('User not found');
            return null;
        }
    } catch (error) {
        console.error('Error finding user by username:', error);
        throw error;
    }
};

exports.setupAccount = async (username, password) => {
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
};

exports.login = async (username, password) => {
    try {
        if (!password || !username) {
            throw new Error('Username and password are required');
        }
        const user = await exports.findUserByUsername(username);
        console.log('Found user:', user);
        if (user) {
            const match = await bcrypt.compare(password, user.hashed_password);
            console.log('Password match:', match);
            return match ? user : null;
        }
        return null;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};