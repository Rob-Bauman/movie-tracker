// src/hooks/useMovies.ts
import { useState, useEffect, useCallback } from 'react';
import { UserMovie } from '../services/storage/movieStorage';
import { useMovieContext } from '../context/MovieContext';

// Custom hook for fetching and managing movies
const useMovies = (initialFilter?: string) => {
  const { movies, collections, isLoading, error, refreshData } = useMovieContext();
  const [filteredMovies, setFilteredMovies] = useState<UserMovie[]>([]);
  const [filter, setFilter] = useState(initialFilter || 'all');
  const [sortBy, setSortBy] = useState<'title' | 'rating' | 'watchDate' | 'addedDate'>('addedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Apply filters and sorting to movies
  const applyFiltersAndSort = useCallback(() => {
    let result = [...movies];
    
    // Apply filter
    if (filter !== 'all') {
      if (filter === 'favorites') {
        result = result.filter(movie => movie.rating >= 4);
      } else if (filter === 'recent') {
        // Get movies watched in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
        result = result.filter(movie => movie.watchDate >= thirtyDaysAgoStr);
      } else if (filter === 'unwatched') {
        result = result.filter(movie => !movie.watchDate);
      } else {
        // Check if filter is a collection ID
        const collection = collections.find(c => c.id === filter);
        if (collection) {
          result = result.filter(movie => collection.movieIds.includes(movie.id));
        }
      }
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      // Get sort values based on sortBy
      switch (sortBy) {
        case 'title':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case 'rating':
          valueA = a.rating || 0;
          valueB = b.rating || 0;
          break;
        case 'watchDate':
          valueA = a.watchDate || '';
          valueB = b.watchDate || '';
          break;
        case 'addedDate':
        default:
          valueA = a.addedDate || '';
          valueB = b.addedDate || '';
          break;
      }
      
      // Compare based on sort order
      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
    
    setFilteredMovies(result);
  }, [movies, collections, filter, sortBy, sortOrder]);

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  // Filter functions
  const filterMovies = (newFilter: string) => {
    setFilter(newFilter);
  };

  // Sort functions
  const sortMovies = (by: 'title' | 'rating' | 'watchDate' | 'addedDate') => {
    if (sortBy === by) {
      // Toggle sort order if same sort field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(by);
      // Default sort orders for different fields
      if (by === 'title') {
        setSortOrder('asc');
      } else {
        setSortOrder('desc');
      }
    }
  };

  // Get statistical data
  const getStats = useCallback(() => {
    const totalMovies = movies.length;
    let totalWatchTime = 0;
    let totalRating = 0;
    let ratedMoviesCount = 0;
    
    movies.forEach(movie => {
      if (movie.runtime) {
        totalWatchTime += movie.runtime;
      }
      
      if (movie.rating) {
        totalRating += movie.rating;
        ratedMoviesCount++;
      }
    });
    
    const averageRating = ratedMoviesCount > 0 
      ? (totalRating / ratedMoviesCount).toFixed(1) 
      : '-';
    
    // Convert total minutes to hours and minutes
    const totalHours = Math.floor(totalWatchTime / 60);
    const totalMinutes = totalWatchTime % 60;
    
    return {
      totalMovies,
      totalWatchTime,
      formattedWatchTime: `${totalHours}h ${totalMinutes}m`,
      averageRating,
    };
  }, [movies]);

  return {
    movies: filteredMovies,
    allMovies: movies,
    isLoading,
    error,
    filter,
    sortBy,
    sortOrder,
    filterMovies,
    sortMovies,
    refreshMovies: refreshData,
    stats: getStats(),
  };
};

export default useMovies;