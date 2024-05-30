require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const config = require('./config/dbConfig');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    connectionLimit: 5,
});

const refreshTokens = [];

// Middleware pour rafraîchir le token
app.post('/api/token', (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).json({ message: 'Token non fourni' });
    }
    if (!refreshTokens.includes(token)) {
        return res.status(403).json({ message: 'Refresh token invalide' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide' });
        }
        const newAccessToken = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ accessToken: newAccessToken });
    });
});

// Inscription
app.post('/api/register', async (req, res) => {
    const { username, password, confirmPassword } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    } else {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const connection = await pool.getConnection();
            await connection.query("INSERT INTO users (username, hashed_password) VALUES (?, ?)", [username, hashedPassword]);
            await connection.end();
            res.status(201).json({ message: 'Votre compte a bien été créé !' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
});

// Connexion
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
    }
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query("SELECT * FROM users WHERE username = ?", [username]);
        await connection.end();
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }
        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.hashed_password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }
        const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '8h' });
        const refreshToken = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET);
        refreshTokens.push(refreshToken);
        res.status(200).json({ token, refreshToken, message: 'Connexion réussie' });
    } catch (err) {
        console.error('Erreur lors de la connexion:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Middleware pour vérifier le token
app.get('/api/user', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);
        try {
            const connection = await pool.getConnection();
            const rows = await connection.query("SELECT username FROM users WHERE user_id = ?", [user.userId]);
            await connection.end();
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
            res.json({ username: rows[0].username });
        } catch (err) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', err);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    });
});

// Ajout d'un film en favori
app.get('/api/favorites', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);
        try {
            const connection = await pool.getConnection();
            const rows = await connection.query("SELECT * FROM favorites WHERE user_id = ?", [user.userId]);
            await connection.end();
            res.json(rows);
        } catch (err) {
            console.error('Erreur lors de la récupération des films favoris:', err);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    });
});

// Afficher tous les films
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // Si aucun jeton n'est fourni, renvoyer 401

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Si le jeton est invalide, renvoyer 403
        req.user = user;
        next();
    });
};

// Appliquer le middleware à la route
app.get('/api/movies', authenticateToken, async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    try {
        const connection = await pool.getConnection();
        const offset = (page - 1) * limit;
        const rows = await connection.query("SELECT movie_id, title, poster_path FROM movies LIMIT ? OFFSET ?", [parseInt(limit), offset]);
        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des films:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});