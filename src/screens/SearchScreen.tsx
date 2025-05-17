// src/screens/SearchScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import useSearch from '../hooks/useSearch';
import { getReleaseYear } from '../utils/dateUtils';
import MovieList from '../components/movie/MovieList';
import { useMovieContext } from '../context/MovieContext'; // <-- Import context


const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const {
    searchResults,
    isLoading,
    error,
    searchMovies,
    totalResults,
    loadMoreResults,
    currentQuery,
  } = useSearch();

  const { movies: userMovies } = useMovieContext(); // <-- Get user's collection

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      searchMovies(searchQuery);
      setHasSearched(true);
    } else {
      setHasSearched(true);
    }
  };

  // Transform TMDB Movie to MovieListItem for MovieList
  const movieListItems = searchResults.map((item) => {
    const userMovie = userMovies.find((m) => m.id === item.id);
    return {
      id: item.id,
      title: item.title,
      year: getReleaseYear(item.release_date),
      posterPath: item.poster_path,
      watchDate: userMovie?.watchDate, // <-- Add watchDate if in collection
      // Add more fields if needed
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={{ flex: 1, position: 'relative' }}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="close-circle" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Icon name="search" size={20} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {!hasSearched ? (
        <View style={styles.emptyState}>
          <Icon name="search-outline" size={48} color={colors.text.secondary} />
          <Text style={styles.emptyStateText}>Search for movies to add to your collection</Text>
        </View>
      ) : searchQuery === '' ? (
        <View style={styles.emptyState}>
          <Icon name="alert-circle-outline" size={48} color={colors.text.secondary} />
          <Text style={styles.emptyStateText}>Please enter a search term</Text>
        </View>
      ) : isLoading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.emptyStateText}>Searching...</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyState}>
          <Icon name="alert-circle-outline" size={48} color={colors.text.secondary} />
          <Text style={styles.emptyStateText}>{error}</Text>
        </View>
      ) : searchResults.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="sad-outline" size={48} color={colors.text.secondary} />
          <Text style={styles.emptyStateText}>No results found</Text>
        </View>
      ) : (
        <MovieList
          movies={movieListItems}
          emptyText="No results found"
          listHeaderComponent={
            <Text style={styles.resultsText}>
              Results for "{currentQuery}" ({totalResults})
            </Text>
          }
          loading={isLoading}
          onEndReached={loadMoreResults}
          onEndReachedThreshold={0.5}
          showYear
          showRating={false}
          compact
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.card.border,
  },
  searchButton: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    marginLeft: spacing.sm,
    borderRadius: borderRadius.md,
  },
  clearButton: {
    position: 'absolute',
    right: spacing.sm,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyStateText: {
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
    fontSize: typography.sizes.md,
  },
  listContainer: {
    paddingBottom: spacing.xl,
  },
  resultsText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.md,
    marginBottom: spacing.md,
  },
  movieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.card.border,
  },
  posterPlaceholder: {
    width: 40,
    height: 60,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  posterImage: {
    width: 40,
    height: 60,
    borderRadius: borderRadius.sm,
  },
  movieInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  movieTitle: {
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  movieYear: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
  },
});

export default SearchScreen;