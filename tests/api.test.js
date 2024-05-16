const request = require('supertest');
const app = require('../app');

describe('API Endpoints', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                username: 'testuser',
                password: 'testpassword'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should login a user', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({
                username: 'testuser',
                password: 'testpassword'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should fetch movies', async () => {
        const res = await request(app).get('/api/movies');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('movies');
    });
});