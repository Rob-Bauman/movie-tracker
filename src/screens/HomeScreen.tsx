import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme/theme';
import MovieList from '../components/movie/MovieList';
import { useMovieContext } from '../context/MovieContext'; // Use context instead of movieStorage
import { UserMovie } from '../services/storage/movieStorage';

const HomeScreen = () => {
  const { movies, isLoading, refreshData } = useMovieContext(); // Use context
  const [recentMovies, setRecentMovies] = useState<UserMovie[]>([]);
  const [stats, setStats] = useState({
    count: 0,
    totalHours: '0',
    avgRating: 0,
  });

  // Calculate stats and recent movies from context movies
  const fetchMoviesAndStats = () => {
    // Recently added (top 5)
    const sorted = movies
      .slice()
      .sort((a, b) => b.addedDate.localeCompare(a.addedDate))
      .slice(0, 5);
    setRecentMovies(sorted);

    // Stats based on all movies
    const count = movies.length;
    const totalMinutes = movies.reduce((sum, m) => sum + (m.runtime || 0), 0);
    const totalHours = count > 0 ? (totalMinutes / 60).toFixed(1) : '0.0';
    const avgRating =
      count > 0
        ? Math.round(
            (movies.reduce((sum, m) => sum + (m.rating || 0), 0) / count) * 10
          ) / 10
        : 0;
    setStats({
      count,
      totalHours,
      avgRating,
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      refreshData();
    }, [refreshData])
  );

  // Update stats and recentMovies when movies change
  React.useEffect(() => {
    fetchMoviesAndStats();
  }, [movies]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to MovieTracker</Text>

      <View style={styles.section}>
        <MovieList
          movies={recentMovies}
          title="Recently Added"
          emptyText="No recently added movies"
          loading={isLoading}
          horizontal
          showYear
          showRating
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.count}</Text>
            <Text style={styles.statLabel}>Movies Watched</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalHours}</Text>
            <Text style={styles.statLabel}>Total Hours</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {stats.count > 0 ? stats.avgRating : '-'}
            </Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Collections</Text>
        <View style={styles.placeholderList}>
          <Text style={styles.placeholderText}>Your collections will appear here</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  welcomeText: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginVertical: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  placeholderList: {
    backgroundColor: colors.card.background,
    borderRadius: 8,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.card.border,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  placeholderText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  statItem: {
    backgroundColor: colors.card.background,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: colors.card.border,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
});

export default HomeScreen;
