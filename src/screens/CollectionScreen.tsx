// src/screens/CollectionScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography, borderRadius } from '../theme/theme';
import { MainTabParamList, RootStackParamList } from '../../App';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type CollectionScreenStackNav = StackNavigationProp<RootStackParamList>;
type CollectionScreenTabNav = BottomTabNavigationProp<MainTabParamList>;

// Placeholder movie data for UI demonstration
const placeholderMovies = [
  { id: 1, title: 'Inception', year: 2010, rating: 5, watchDate: '2023-01-15' },
  { id: 2, title: 'The Dark Knight', year: 2008, rating: 4, watchDate: '2023-02-20' },
  { id: 3, title: 'Interstellar', year: 2014, rating: 5, watchDate: '2023-03-05' },
];

const CollectionScreen = () => {
  const stackNavigation = useNavigation<CollectionScreenStackNav>();
  const tabNavigation = useNavigation<CollectionScreenTabNav>();
  const [filterOption, setFilterOption] = useState('all');
  
  // In the actual implementation, this will filter from AsyncStorage/SQLite
  const filteredMovies = placeholderMovies;

  const navigateToMovieDetails = (movieId: number) => {
    stackNavigation.navigate('MovieDetails', { movieId });
  };

  const renderMovieItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.movieItem} 
      onPress={() => navigateToMovieDetails(item.id)}
    >
      <View style={styles.posterPlaceholder}>
        <Icon name="film-outline" size={24} color={colors.text.secondary} />
      </View>
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieYear}>{item.year}</Text>
        <View style={styles.movieMeta}>
          <View style={styles.ratingContainer}>
            {Array(5).fill(0).map((_, index) => (
              <Icon 
                key={index}
                name={index < item.rating ? 'star' : 'star-outline'} 
                size={14} 
                color={colors.rating.active}
                style={styles.starIcon}
              />
            ))}
          </View>
          <Text style={styles.watchDate}>Watched: {item.watchDate}</Text>
        </View>
      </View>
      <Icon name="chevron-forward" size={20} color={colors.text.secondary} />
    </TouchableOpacity>
  );

  const renderEmptyCollection = () => (
    <View style={styles.emptyState}>
      <Icon name="film-outline" size={48} color={colors.text.secondary} />
      <Text style={styles.emptyStateText}>Your collection is empty</Text>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => tabNavigation.navigate('Search')}
      >
        <Text style={styles.addButtonText}>Find Movies to Add</Text>
      </TouchableOpacity>
    </View>
  );

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

      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovieItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyCollection}
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
  listContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
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
    marginBottom: spacing.xs,
  },
  movieMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    marginRight: 2,
  },
  watchDate: {
    color: colors.text.secondary,
    fontSize: typography.sizes.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  emptyStateText: {
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
    fontSize: typography.sizes.md,
    marginBottom: spacing.lg,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  addButtonText: {
    color: colors.text.primary,
    fontSize: typography.sizes.md,
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