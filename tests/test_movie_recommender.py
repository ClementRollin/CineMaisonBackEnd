import unittest
import pandas as pd
from movie_recommender import MovieRecommender

class TestMovieRecommender(unittest.TestCase):
    def setUp(self):
        # Create a sample dataframe
        self.movies = pd.DataFrame({
            'title': ['Movie1', 'Movie2', 'Movie3'],
            'genres': ['Action', 'Comedy', 'Drama'],
            'director': ['Director1', 'Director2', 'Director3'],
            'actors': ['Actor1', 'Actor2', 'Actor3'],
            'keywords': ['Keyword1', 'Keyword2', 'Keyword3'],
            'mood': ['Happy', 'Sad', 'Neutral'],
            'duration': [120, 90, 150],
            'averageRating': [7.0, 8.0, 9.0],
            'numVotes': [1000, 2000, 3000]
        })
        self.recommender = MovieRecommender(self.movies)

    def test_recommend_movies(self):
        user_preferences = {
            'features': 'Action Director1 Actor1 Keyword1',
            'mood': 'Happy',
            'time': 120
        }
        recommended_movies = self.recommender.recommend_movies(user_preferences)
        # Check that the recommended movies are as expected
        self.assertEqual(recommended_movies.iloc[0]['title'], 'Movie1')

if __name__ == '__main__':
    unittest.main()