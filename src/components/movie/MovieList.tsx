// src/components/movie/MovieList.tsx
import React from 'react';
import { FlatList, StyleSheet, Text, View, ListRenderItemInfo } from 'react-native';
import { colors, spacing, typography } from '../../theme/theme';
import MovieCard from './MovieCard';

// Type for movies that can be displayed in the list
export interface MovieListItem {
  id: number;
  title: string;
  year?: string;
  posterPath?: string | null;
  rating?: number;
  genres?: string[];
  watchDate?: string;
}

interface MovieListProps {
  movies: MovieListItem[];
  title?: string;
  emptyText?: string;
  loading?: boolean;
  horizontal?: boolean;
  compact?: boolean;
  showYear?: boolean;
  showRating?: boolean;
  listHeaderComponent?: React.ReactElement | null;
  onEndReached?: () => void; // <-- Add this line
  onEndReachedThreshold?: number; // <-- Add this line
}

const MovieList: React.FC<MovieListProps> = ({
  movies,
  title,
  emptyText = 'No movies found',
  loading = false,
  horizontal = false,
  compact = false,
  showYear = true,
  showRating = true,
  listHeaderComponent,
  onEndReached, // <-- Add this line
  onEndReachedThreshold, // <-- Add this line
}) => {
  // Render a single movie item
  const renderMovie = ({ item }: ListRenderItemInfo<MovieListItem>) => (
    <View style={horizontal ? styles.horizontalItem : styles.verticalItem}>
      <MovieCard
        id={item.id}
        title={item.title}
        year={showYear ? item.year : undefined}
        posterPath={item.posterPath}
        rating={showRating ? item.rating : undefined}
        genres={item.genres}
        compact={compact}
        watchDate={item.watchDate}
      />
    </View>
  );

  // Render empty component
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{loading ? 'Loading...' : emptyText}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      
      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={[
          horizontal ? styles.horizontalList : styles.verticalList,
          movies.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={listHeaderComponent}
        onEndReached={onEndReached} // <-- Add this line
        onEndReachedThreshold={onEndReachedThreshold} // <-- Add this line
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  horizontalList: {
    gap: spacing.sm,
  },
  verticalList: {
    paddingVertical: spacing.md,
  },
  horizontalItem: {
    width: 150,
  },
  verticalItem: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.md,
    textAlign: 'center',
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default MovieList;