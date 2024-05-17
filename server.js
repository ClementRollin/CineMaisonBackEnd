const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');
const bcrypt = require('bcrypt');
const cors = require('cors');
const config = require('./config/dbConfig');

const app = express();
app.use(cors());  // Ajoutez cette ligne
app.use(bodyParser.json());

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    connectionLimit: 5,
});

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
        const token = jwt.sign({ userId: user.id }, 'votre_secret_key', { expiresIn: '1h' });
        res.status(200).json({ token, message: 'Connexion réussie' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});