const axios = require('axios');

const getRecommendations = async (userId, topN = 10) => {
    try {
        const response = await axios.post('http://localhost:80/recommendations', {
            user_id: userId,
            top_n: topN
        });
        return response.data.recommendations;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
    }
};

module.exports = { getRecommendations };