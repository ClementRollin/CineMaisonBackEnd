const request = require('supertest');
const app = require('../src/app');

describe('Movies API routes', () => {
    test('GET /api/movies should return some movies', async () => {
        const response = await request(app).get('/api/movies');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.anything());
    });
});