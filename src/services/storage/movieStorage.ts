// src/services/storage/movieStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types for stored movie data
export interface UserMovie {
  id: number;             // Movie ID from TMDB API
  tmdbId: number;         // Duplicate of id for clarity (both reference TMDB ID)
  title: string;          // Movie title
  year: string;           // Release year
  posterPath: string | null; // Path to poster image
  watchDate: string;      // When the user watched the movie (YYYY-MM-DD)
  rating: number;         // User rating (1-5)
  notes: string;          // User's notes or review
  genres: string[];       // Movie genres
  director: string;       // Movie director
  runtime: number;        // Runtime in minutes
  addedDate: string;      // When the movie was added to collection
  sawInTheaters?: boolean; // Whether the movie was seen in theaters
  recommendedBy?: string; // Name of the person who recommended the movie
}

// Renamed from MovieCollection to MovieList
export interface MovieList {
  id: string;             // Unique ID for the list
  name: string;           // List name
  description: string;    // List description
  movieIds: number[];     // IDs of movies in this list
  createdDate: string;    // When the list was created
}

// Storage keys
const STORAGE_KEYS = {
  MOVIES: '@MovieTracker:movies',
  LISTS: '@MovieTracker:lists',
  SETTINGS: '@MovieTracker:settings',
};

type SortDirection = 'asc' | 'desc';
type SortField = keyof UserMovie;

export interface GetMoviesOptions {
  sortBy?: SortField;
  direction?: SortDirection;
}

// MovieStorage service
const movieStorage = {
  // Get all movies from storage, sorted by addedDate descending by default
  getMovies: async (options?: GetMoviesOptions): Promise<UserMovie[]> => {
    try {
      const moviesJson = await AsyncStorage.getItem(STORAGE_KEYS.MOVIES);
      let movies: UserMovie[] = moviesJson ? JSON.parse(moviesJson) : [];

      // Sorting
      const sortBy: SortField = options?.sortBy || 'addedDate';
      const direction: SortDirection = options?.direction || 'desc';

      movies = movies.slice().sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });

      return movies;
    } catch (error) {
      console.error('Error retrieving movies from storage:', error);
      return [];
    }
  },

  // Add a movie to storage
  addMovie: async (movie: UserMovie): Promise<boolean> => {
    try {
      // First get existing movies
      const existingMovies = await movieStorage.getMovies();
      
      // Check if movie already exists
      const movieExists = existingMovies.some(m => m.id === movie.id);
      if (movieExists) {
        return false; // Movie already exists
      }
      
      // Add new movie
      const updatedMovies = [...existingMovies, {
        ...movie,
        addedDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      }];
      
      // Save updated movies array
      await AsyncStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(updatedMovies));
      return true;
    } catch (error) {
      console.error('Error adding movie to storage:', error);
      return false;
    }
  },

  // Update an existing movie
  updateMovie: async (updatedMovie: UserMovie): Promise<boolean> => {
    try {
      const existingMovies = await movieStorage.getMovies();
      const movieIndex = existingMovies.findIndex(m => m.id === updatedMovie.id);
      
      if (movieIndex === -1) {
        return false; // Movie not found
      }
      
      // Update the movie
      existingMovies[movieIndex] = updatedMovie;
      
      // Save updated movies array
      await AsyncStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(existingMovies));
      return true;
    } catch (error) {
      console.error('Error updating movie in storage:', error);
      return false;
    }
  },

  // Remove a movie from storage
  removeMovie: async (movieId: number): Promise<boolean> => {
    try {
      const existingMovies = await movieStorage.getMovies();
      const updatedMovies = existingMovies.filter(movie => movie.id !== movieId);
      
      if (updatedMovies.length === existingMovies.length) {
        return false; // Movie not found
      }
      
      // Save updated movies array
      await AsyncStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(updatedMovies));
      
      // Also remove movie from any lists
      const lists = await movieStorage.getLists();
      let listsUpdated = false;
      
      const updatedLists = lists.map(list => {
        if (list.movieIds.includes(movieId)) {
          listsUpdated = true;
          return {
            ...list,
            movieIds: list.movieIds.filter(id => id !== movieId),
          };
        }
        return list;
      });
      
      if (listsUpdated) {
        await AsyncStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(updatedLists));
      }
      
      return true;
    } catch (error) {
      console.error('Error removing movie from storage:', error);
      return false;
    }
  },

  // Get a single movie by ID
  getMovieById: async (movieId: number): Promise<UserMovie | null> => {
    try {
      const movies = await movieStorage.getMovies();
      const movie = movies.find(m => m.id === movieId);
      return movie || null;
    } catch (error) {
      console.error(`Error retrieving movie ID ${movieId} from storage:`, error);
      return null;
    }
  },

  // Lists management
  getLists: async (): Promise<MovieList[]> => {
    try {
      const listsJson = await AsyncStorage.getItem(STORAGE_KEYS.LISTS);
      return listsJson ? JSON.parse(listsJson) : [];
    } catch (error) {
      console.error('Error retrieving lists from storage:', error);
      return [];
    }
  },

  addList: async (list: Omit<MovieList, 'createdDate'>): Promise<boolean> => {
    try {
      const existingLists = await movieStorage.getLists();
      
      // Create new list with ID and created date
      const newList: MovieList = {
        ...list,
        id: Date.now().toString(), // Simple ID generation
        createdDate: new Date().toISOString().split('T')[0],
      };
      
      const updatedLists = [...existingLists, newList];
      await AsyncStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(updatedLists));
      return true;
    } catch (error) {
      console.error('Error adding list to storage:', error);
      return false;
    }
  },

  updateList: async (updatedList: MovieList): Promise<boolean> => {
    try {
      const existingLists = await movieStorage.getLists();
      const listIndex = existingLists.findIndex(l => l.id === updatedList.id);
      
      if (listIndex === -1) {
        return false; // List not found
      }
      
      existingLists[listIndex] = updatedList;
      await AsyncStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(existingLists));
      return true;
    } catch (error) {
      console.error('Error updating list in storage:', error);
      return false;
    }
  },

  removeList: async (listId: string): Promise<boolean> => {
    try {
      const existingLists = await movieStorage.getLists();
      const updatedLists = existingLists.filter(l => l.id !== listId);
      
      if (updatedLists.length === existingLists.length) {
        return false; // List not found
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(updatedLists));
      return true;
    } catch (error) {
      console.error('Error removing list from storage:', error);
      return false;
    }
  },

  // Add movie to list
  addMovieToList: async (movieId: number, listId: string): Promise<boolean> => {
    try {
      const existingLists = await movieStorage.getLists();
      const listIndex = existingLists.findIndex(l => l.id === listId);
      
      if (listIndex === -1) {
        return false; // List not found
      }
      
      const list = existingLists[listIndex];
      
      // Check if movie is already in list
      if (list.movieIds.includes(movieId)) {
        return true; // Movie already in list
      }
      
      // Add movie to list
      list.movieIds.push(movieId);
      existingLists[listIndex] = list;
      
      await AsyncStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(existingLists));
      return true;
    } catch (error) {
      console.error('Error adding movie to list in storage:', error);
      return false;
    }
  },

  // Remove movie from list
  removeMovieFromList: async (movieId: number, listId: string): Promise<boolean> => {
    try {
      const existingLists = await movieStorage.getLists();
      const listIndex = existingLists.findIndex(l => l.id === listId);
      
      if (listIndex === -1) {
        return false; // List not found
      }
      
      const list = existingLists[listIndex];
      
      // Check if movie is in list
      if (!list.movieIds.includes(movieId)) {
        return false; // Movie not in list
      }
      
      // Remove movie from list
      list.movieIds = list.movieIds.filter(id => id !== movieId);
      existingLists[listIndex] = list;
      
      await AsyncStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(existingLists));
      return true;
    } catch (error) {
      console.error('Error removing movie from list in storage:', error);
      return false;
    }
  },

  // Clear all data (for settings)
  clearAllData: async (): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.MOVIES);
      await AsyncStorage.removeItem(STORAGE_KEYS.LISTS);
      return true;
    } catch (error) {
      console.error('Error clearing all data from storage:', error);
      return false;
    }
  },
};

export default movieStorage;