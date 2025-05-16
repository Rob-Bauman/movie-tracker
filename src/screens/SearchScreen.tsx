// src/screens/SearchScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';

// Placeholder movie data for UI demonstration
const placeholderMovies = [
  { id: 1, title: 'Sample Movie 1', year: 2023 },
  { id: 2, title: 'Sample Movie 2', year: 2022 },
  { id: 3, title: 'Sample Movie 3', year: 2021 },
];

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    // This will be replaced with actual API call
    setHasSearched(true);
  };

  const renderMovieItem = ({ item }: { item: { id: number; title: string; year: number } }) => (
    <TouchableOpacity style={styles.movieItem}>
      <View style={styles.posterPlaceholder}>
        <Icon name="film-outline" size={24} color={colors.text.secondary} />
      </View>
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieYear}>{item.year}</Text>
      </View>
      <Icon name="chevron-forward" size={20} color={colors.text.secondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies..."
          placeholderTextColor={colors.text.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
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
      ) : (
        <FlatList
          data={placeholderMovies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieItem}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            <Text style={styles.resultsText}>
              Results for "{searchQuery}"
            </Text>
          }
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