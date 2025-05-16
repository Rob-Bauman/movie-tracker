// src/services/api/tmdbApi.ts
import axios from 'axios';
import { API_BASE_URL, API_KEY, IMAGE_BASE_URL, IMAGE_SIZES, ENDPOINTS, REQUEST_TIMEOUT } from './config';

// Setup axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  params: {
    api_key: API_KEY,
  },
});

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
    try {
      const response = await apiClient.get(ENDPOINTS.SEARCH_MOVIE, {
        params: {
          query,
          page,
          include_adult: false,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Get movie details
  getMovieDetails: async (movieId: number): Promise<Movie> => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.MOVIE_DETAILS}/${movieId}`, {
        params: {
          append_to_response: 'videos,images',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie details for ID ${movieId}:`, error);
      throw error;
    }
  },

  // Get movie credits (cast & crew)
  getMovieCredits: async (movieId: number): Promise<MovieCredits> => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.MOVIE_DETAILS}/${movieId}/credits`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie credits for ID ${movieId}:`, error);
      throw error;
    }
  },

  // Get popular movies
  getPopularMovies: async (page = 1): Promise<MovieSearchResponse> => {
    try {
      const response = await apiClient.get(ENDPOINTS.POPULAR_MOVIES, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  // Get trending movies
  getTrendingMovies: async (page = 1): Promise<MovieSearchResponse> => {
    try {
      const response = await apiClient.get(ENDPOINTS.TRENDING_MOVIES, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },
};

export default movieApi;