// src/services/api/tmdbApi.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_KEY } from '@env'; // Ensure you have your API key in .env file
import { API_BASE_URL, IMAGE_BASE_URL, IMAGE_SIZES, ENDPOINTS, REQUEST_TIMEOUT } from './config';

// Setup axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  params: {
    api_key: API_KEY,
  },
});

// Storage keys for API cache
const API_CACHE_KEYS = {
  SEARCH_MOVIES: '@MovieTracker:api:searchMovies:',
  MOVIE_DETAILS: '@MovieTracker:api:movieDetails:',
  MOVIE_CREDITS: '@MovieTracker:api:movieCredits:',
  POPULAR_MOVIES: '@MovieTracker:api:popularMovies:',
  TRENDING_MOVIES: '@MovieTracker:api:trendingMovies:',
};

// Helper to get/set cache with TTL (default: 1 day)
const CACHE_TTL = 24 * 60 * 60 * 1000; // 1 day in ms

async function getCachedOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = CACHE_TTL
): Promise<T> {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (cached) {
      const { value, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < ttl) {
        return value;
      }
    }
    const value = await fetchFn();
    await AsyncStorage.setItem(key, JSON.stringify({ value, timestamp: Date.now() }));
    return value;
  } catch (e) {
    // On error, fallback to fetch
    return fetchFn();
  }
}

// Interfaces for API responses
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
}

export interface MovieSearchResponse {
  page: number;
  results: Movie[];
  total_results: number;
  total_pages: number;
}

export interface MovieCredits {
  id: number;
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
  }[];
  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }[];
}

// Helper function to build image URLs
export const getImageUrl = (
  path: string | null, 
  type: 'poster' | 'backdrop' | 'profile' = 'poster', 
  size: 'small' | 'medium' | 'large' | 'original' = 'medium'
): string | null => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${IMAGE_SIZES[type][size]}${path}`;
};

// API Functions
export const movieApi = {
  // Search for movies
  searchMovies: async (query: string, page = 1): Promise<MovieSearchResponse> => {
    const cacheKey = `${API_CACHE_KEYS.SEARCH_MOVIES}${query.toLowerCase()}_${page}`;
    return getCachedOrFetch(cacheKey, async () => {
      const response = await apiClient.get(ENDPOINTS.SEARCH_MOVIE, {
        params: { query, page, include_adult: false },
      });
      return response.data;
    });
  },

  // Get movie details
  getMovieDetails: async (movieId: number): Promise<Movie> => {
    const cacheKey = `${API_CACHE_KEYS.MOVIE_DETAILS}${movieId}`;
    return getCachedOrFetch(cacheKey, async () => {
      const response = await apiClient.get(`${ENDPOINTS.MOVIE_DETAILS}/${movieId}`, {
        params: { append_to_response: 'videos,images' },
      });
      return response.data;
    });
  },

  // Get movie credits (cast & crew)
  getMovieCredits: async (movieId: number): Promise<MovieCredits> => {
    const cacheKey = `${API_CACHE_KEYS.MOVIE_CREDITS}${movieId}`;
    return getCachedOrFetch(cacheKey, async () => {
      const response = await apiClient.get(`${ENDPOINTS.MOVIE_DETAILS}/${movieId}/credits`);
      return response.data;
    });
  },

  // Get popular movies
  getPopularMovies: async (page = 1): Promise<MovieSearchResponse> => {
    const cacheKey = `${API_CACHE_KEYS.POPULAR_MOVIES}${page}`;
    return getCachedOrFetch(cacheKey, async () => {
      const response = await apiClient.get(ENDPOINTS.POPULAR_MOVIES, {
        params: { page },
      });
      return response.data;
    });
  },

  // Get trending movies
  getTrendingMovies: async (page = 1): Promise<MovieSearchResponse> => {
    const cacheKey = `${API_CACHE_KEYS.TRENDING_MOVIES}${page}`;
    return getCachedOrFetch(cacheKey, async () => {
      const response = await apiClient.get(ENDPOINTS.TRENDING_MOVIES, {
        params: { page },
      });
      return response.data;
    });
  },
};

export default movieApi;