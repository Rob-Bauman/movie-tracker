// src/services/api/config.ts
// API Configuration for The Movie Database (TMDB)

// This would typically be in an .env file
// For demonstration purposes, we'll define it here
// In a real app, use react-native-dotenv to load from .env
export const API_KEY = 'YOUR_TMDB_API_KEY'; // Replace with your TMDB API key

// API Base URLs
export const API_BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image sizes available from TMDB
export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original',
  },
};

// API Endpoints
export const ENDPOINTS = {
  SEARCH_MOVIE: '/search/movie',
  MOVIE_DETAILS: '/movie',
  MOVIE_CREDITS: '/movie/{movie_id}/credits',
  MOVIE_IMAGES: '/movie/{movie_id}/images',
  MOVIE_VIDEOS: '/movie/{movie_id}/videos',
  POPULAR_MOVIES: '/movie/popular',
  TOP_RATED_MOVIES: '/movie/top_rated',
  UPCOMING_MOVIES: '/movie/upcoming',
  TRENDING_MOVIES: '/trending/movie/week',
};

// API request timeout (in milliseconds)
export const REQUEST_TIMEOUT = 10000; // 10 seconds