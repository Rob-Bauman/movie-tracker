// src/screens/CollectionScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography, borderRadius } from '../theme/theme';
import { MainTabParamList, RootStackParamList } from '../../App';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import MovieList from '../components/movie/MovieList';
import { useMovieContext } from '../context/MovieContext'; // <-- Use context

type CollectionScreenStackNav = StackNavigationProp<RootStackParamList>;
type CollectionScreenTabNav = BottomTabNavigationProp<MainTabParamList>;

const CollectionScreen = () => {
  const stackNavigation = useNavigation<CollectionScreenStackNav>();
  const tabNavigation = useNavigation<CollectionScreenTabNav>();
  const [filterOption, setFilterOption] = useState('all');
  const { movies, isLoading, refreshData } = useMovieContext(); // <-- Use context

  // Reload movies when screen is focused
  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [refreshData])
  );

  // Filtering logic (expand as needed)
  const filteredMovies = movies; // You can add filter logic based on filterOption

  const navigateToMovieDetails = (movieId: number) => {
    stackNavigation.navigate('MovieDetails', { movieId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterOption, filterOption === 'all' && styles.activeFilter]} 
          onPress={() => setFilterOption('all')}
        >
          <Text style={[styles.filterText, filterOption === 'all' && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterOption, filterOption === 'recent' && styles.activeFilter]} 
          onPress={() => setFilterOption('recent')}
        >
          <Text style={[styles.filterText, filterOption === 'recent' && styles.activeFilterText]}>Recent</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterOption, filterOption === 'favorites' && styles.activeFilter]} 
          onPress={() => setFilterOption('favorites')}
        >
          <Text style={[styles.filterText, filterOption === 'favorites' && styles.activeFilterText]}>Favorites</Text>
        </TouchableOpacity>
      </View>

      <MovieList
        movies={filteredMovies}
        emptyText="Your collection is empty"
        loading={isLoading}
        showYear
        showRating
        compact
        // vertical by default, so no need for horizontal prop
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => tabNavigation.navigate('Search')}
      >
        <Icon name="add" size={24} color={colors.text.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.card.border,
  },
  filterOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
  },
  activeFilterText: {
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default CollectionScreen;