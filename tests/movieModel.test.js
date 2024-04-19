const Movie = require('../src/models/movieModel');
const pool = require('../src/config/dbConfig');

afterAll(async () => {
    await pool.end();
});

describe('Movie Model Tests', () => {
    it('should fetch all movies', async () => {
        const movies = await Movie.fetchAll();
        expect(movies).toBeInstanceOf(Array);
    }, 20000);

    it('should insert a movie', async () => {
        const movie = {
            title: 'Test Movie',
            synopsis: 'A test movie.',
            cast: '["Actor 1", "Actor 2"]',
            trailer_link: 'http://example.com/trailer',
            streaming_platforms: '["Netflix", "HBO"]',
            genres: '1,2',
            duration: 120
        };
        const result = await Movie.insert(movie);
        expect(result.affectedRows).toEqual(1);
    }, 20000);
});