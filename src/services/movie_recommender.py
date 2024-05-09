from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class MovieRecommender:
    def __init__(self, movies):
        self.movies = movies
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.movies['features'] = self.movies['genres'] + ' ' + self.movies['director'] + ' ' + self.movies['actors'] + ' ' + self.movies['keywords']
        self.movies_matrix = self.vectorizer.fit_transform(self.movies['features'])

    def recommend_movies(self, user_preferences, top_n=10):
        # Transform user_preferences into a query vector
        query_vector = self.vectorizer.transform([user_preferences['features']])
        
        # Compute the cosine similarity between the query vector and all movie vectors
        cosine_similarities = cosine_similarity(query_vector, self.movies_matrix).flatten()
        
        # Get the top_n most similar movies
        top_movie_indices = cosine_similarities.argsort()[:-top_n - 1:-1]
        recommended_movies = self.movies.iloc[top_movie_indices]
        
        # Filter movies based on user's mood and available time
        recommended_movies = recommended_movies[recommended_movies['mood'] == user_preferences['mood']]
        recommended_movies = recommended_movies[recommended_movies['duration'] <= user_preferences['time']]
        
        # Sort movies by user ratings
        recommended_movies = recommended_movies.sort_values(by=['averageRating', 'numVotes'], ascending=False)
        
        return recommended_movies