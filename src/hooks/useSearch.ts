// src/hooks/useSearch.ts
import { useState, useCallback } from 'react';
import { movieApi, Movie, MovieSearchResponse } from '../services/api/tmdbApi';

interface UseSearchResult {
  searchResults: Movie[];
  isLoading: boolean;
  error: string | null;
  currentQuery: string;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  searchMovies: (query: string, page?: number) => Promise<void>;
  loadMoreResults: () => Promise<void>;
}

const useSearch = (): UseSearchResult => {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Search movies using the TMDB API
  const searchMovies = useCallback(async (query: string, page = 1) => {
    if (!query.trim()) {
      setSearchResults([]);
      setCurrentQuery('');
      setTotalResults(0);
      setCurrentPage(1);
      setTotalPages(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response: MovieSearchResponse = await movieApi.searchMovies(query, page);
      
      setSearchResults(page === 1 ? response.results : [...searchResults, ...response.results]);
      setCurrentQuery(query);
      setTotalResults(response.total_results);
      setCurrentPage(response.page);
      setTotalPages(response.total_pages);
    } catch (err) {
      setError('Error searching for movies. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchResults]);

  // Load more results (next page) for the current query
  const loadMoreResults = useCallback(async () => {
    if (!currentQuery || isLoading || currentPage >= totalPages) {
      return;
    }

    await searchMovies(currentQuery, currentPage + 1);
  }, [currentQuery, isLoading, currentPage, totalPages, searchMovies]);

  return {
    searchResults,
    isLoading,
    error,
    currentQuery,
    totalResults,
    currentPage,
    totalPages,
    searchMovies,
    loadMoreResults,
  };
};

export default useSearch;