const jwt = require('jsonwebtoken');

class AuthService {
    constructor() {
        this.secret = 'secret-key'; // secret key
    }

    generateToken(user) {
        // Expires in 24 hours
        return jwt.sign({ id: user.id }, this.secret, { expiresIn: '24h' });
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.secret);
        } catch (err) {
            return null;
        }
    }
}

module.exports = AuthService;