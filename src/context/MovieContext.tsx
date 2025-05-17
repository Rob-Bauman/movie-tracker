// src/context/MovieContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserMovie, MovieList } from '../services/storage/movieStorage';
import movieStorage from '../services/storage/movieStorage';

// Define context types
interface MovieContextType {
  // Movie state
  movies: UserMovie[];
  lists: MovieList[];
  isLoading: boolean;
  error: string | null;
  
  // Movie actions
  addMovie: (movie: UserMovie) => Promise<boolean>;
  updateMovie: (movie: UserMovie) => Promise<boolean>;
  removeMovie: (movieId: number) => Promise<boolean>;
  getMovieById: (movieId: number) => Promise<UserMovie | null>;
  
  // List actions
  addList: (list: Omit<MovieList, 'createdDate' | 'id'>) => Promise<boolean>;
  updateList: (list: MovieList) => Promise<boolean>;
  removeList: (listId: string) => Promise<boolean>;
  addMovieToList: (movieId: number, listId: string) => Promise<boolean>;
  removeMovieFromList: (movieId: number, listId: string) => Promise<boolean>;
  
  // Data management
  refreshData: () => Promise<void>;
  clearAllData: () => Promise<boolean>;
}

// Create the context
const MovieContext = createContext<MovieContextType | undefined>(undefined);

// Provider component
export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<UserMovie[]>([]);
  const [lists, setLists] = useState<MovieList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all data from storage
  const loadStorageData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const moviesData = await movieStorage.getMovies();
      const listsData = await movieStorage.getLists();
      
      setMovies(moviesData);
      setLists(listsData);
    } catch (err) {
      setError('Failed to load data from storage');
      console.error('Error loading data from storage:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadStorageData();
  }, [loadStorageData]);

  // Refresh data
  const refreshData = useCallback(async () => {
    await loadStorageData();
  }, [loadStorageData]);

  // Add a movie to the global collection
  const addMovie = async (movie: UserMovie): Promise<boolean> => {
    try {
      const success = await movieStorage.addMovie(movie);
      if (success) {
        setMovies(prevMovies => [...prevMovies, {
          ...movie,
          addedDate: new Date().toISOString().split('T')[0],
        }]);
      }
      return success;
    } catch (err) {
      setError('Failed to add movie');
      console.error('Error adding movie:', err);
      return false;
    }
  };

  // Update a movie
  const updateMovie = async (movie: UserMovie): Promise<boolean> => {
    try {
      const success = await movieStorage.updateMovie(movie);
      if (success) {
        setMovies(prevMovies => 
          prevMovies.map(m => m.id === movie.id ? movie : m)
        );
      }
      return success;
    } catch (err) {
      setError('Failed to update movie');
      console.error('Error updating movie:', err);
      return false;
    }
  };

  // Remove a movie
  const removeMovie = async (movieId: number): Promise<boolean> => {
    try {
      const success = await movieStorage.removeMovie(movieId);
      if (success) {
        setMovies(prevMovies => prevMovies.filter(m => m.id !== movieId));
        
        // Also update lists that contained this movie
        setLists(prevLists => 
          prevLists.map(list => ({
            ...list,
            movieIds: list.movieIds.filter(id => id !== movieId),
          }))
        );
      }
      return success;
    } catch (err) {
      setError('Failed to remove movie');
      console.error('Error removing movie:', err);
      return false;
    }
  };

  // Get movie by ID
  const getMovieById = async (movieId: number): Promise<UserMovie | null> => {
    try {
      return await movieStorage.getMovieById(movieId);
    } catch (err) {
      setError('Failed to get movie');
      console.error('Error getting movie:', err);
      return null;
    }
  };

  // Add a list
  const addList = async (list: Omit<MovieList, 'createdDate' | 'id'>): Promise<boolean> => {
    try {
      const listWithId = {
        ...list,
        id: Date.now().toString(),
      };
      const success = await movieStorage.addList(listWithId);
      if (success) {
        setLists(prevLists => [...prevLists, {
          ...listWithId,
          createdDate: new Date().toISOString().split('T')[0],
        }]);
      }
      return success;
    } catch (err) {
      setError('Failed to add list');
      console.error('Error adding list:', err);
      return false;
    }
  };

  // Update a list
  const updateList = async (list: MovieList): Promise<boolean> => {
    try {
      const success = await movieStorage.updateList(list);
      if (success) {
        setLists(prevLists => 
          prevLists.map(l => l.id === list.id ? list : l)
        );
      }
      return success;
    } catch (err) {
      setError('Failed to update list');
      console.error('Error updating list:', err);
      return false;
    }
  };

  // Remove a list
  const removeList = async (listId: string): Promise<boolean> => {
    try {
      const success = await movieStorage.removeList(listId);
      if (success) {
        setLists(prevLists => 
          prevLists.filter(l => l.id !== listId)
        );
      }
      return success;
    } catch (err) {
      setError('Failed to remove list');
      console.error('Error removing list:', err);
      return false;
    }
  };

  // Add movie to list
  const addMovieToList = async (movieId: number, listId: string): Promise<boolean> => {
    try {
      const success = await movieStorage.addMovieToList(movieId, listId);
      if (success) {
        setLists(prevLists => 
          prevLists.map(list => {
            if (list.id === listId && !list.movieIds.includes(movieId)) {
              return {
                ...list,
                movieIds: [...list.movieIds, movieId],
              };
            }
            return list;
          })
        );
      }
      return success;
    } catch (err) {
      setError('Failed to add movie to list');
      console.error('Error adding movie to list:', err);
      return false;
    }
  };

  // Remove movie from list
  const removeMovieFromList = async (movieId: number, listId: string): Promise<boolean> => {
    try {
      const success = await movieStorage.removeMovieFromList(movieId, listId);
      if (success) {
        setLists(prevLists => 
          prevLists.map(list => {
            if (list.id === listId) {
              return {
                ...list,
                movieIds: list.movieIds.filter(id => id !== movieId),
              };
            }
            return list;
          })
        );
      }
      return success;
    } catch (err) {
      setError('Failed to remove movie from list');
      console.error('Error removing movie from list:', err);
      return false;
    }
  };

  // Clear all data
  const clearAllData = async (): Promise<boolean> => {
    try {
      const success = await movieStorage.clearAllData();
      if (success) {
        setMovies([]);
        setLists([]);
      }
      return success;
    } catch (err) {
      setError('Failed to clear data');
      console.error('Error clearing data:', err);
      return false;
    }
  };

  // Value object to be provided to consumers
  const value: MovieContextType = {
    movies,
    lists,
    isLoading,
    error,
    addMovie,
    updateMovie,
    removeMovie,
    getMovieById,
    addList,
    updateList,
    removeList,
    addMovieToList,
    removeMovieFromList,
    refreshData,
    clearAllData,
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};

// Custom hook for using the movie context
export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
};

export default MovieContext;