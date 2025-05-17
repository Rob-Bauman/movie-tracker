// src/screens/MovieDetailsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography, borderRadius } from '../theme/theme';
import { RootStackParamList } from '../../App';
import movieApi, { Movie, MovieCredits, getImageUrl } from '../services/api/tmdbApi';
import { UserMovie } from '../services/storage/movieStorage';
import { useMovieContext } from '../context/MovieContext'; // <-- Use context

type MovieDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MovieDetails'>;
type MovieDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MovieDetails'>;

type Props = {
  route: MovieDetailsScreenRouteProp;
  navigation: MovieDetailsScreenNavigationProp;
};

const MovieDetailsScreen = ({ route, navigation }: Props) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<MovieCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inCollection, setInCollection] = useState(false);
  const [userMovie, setUserMovie] = useState<UserMovie | null>(null);

  const { movies, removeMovie, refreshData } = useMovieContext(); // <-- Use context

  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const [movieDetails, movieCredits] = await Promise.all([
          movieApi.getMovieDetails(movieId),
          movieApi.getMovieCredits(movieId),
        ]);
        if (isMounted) {
          setMovie(movieDetails);
          setCredits(movieCredits);
        }
      } catch (err) {
        if (isMounted) setError('Failed to load movie details.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [movieId]);

  // Check if movie is in collection using context
  useEffect(() => {
    if (!movie) return;
    const found = movies.find((m) => m.id === movie.id);
    setInCollection(!!found);
    setUserMovie(found || null);
  }, [movie, movies]);

  const handleAddToCollection = async () => {
    if (!movie || !credits) return;
    navigation.navigate('AddMovie', { movie, credits });
  };

  const handleRemoveFromCollection = async () => {
    if (!movie) return;
    await removeMovie(movie.id); // <-- Use context
    setInCollection(false);
    setUserMovie(null);
    refreshData();
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Icon name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={styles.noPosterText}>{error || 'Movie not found.'}</Text>
      </View>
    );
  }

  // Get director and cast from credits
  const director = credits?.crew.find((c) => c.job === 'Director')?.name || 'Unknown';
  const cast = credits?.cast.slice(0, 5).map((c) => c.name) || [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.posterContainer}>
          {movie.poster_path ? (
            <Image
              source={{ uri: getImageUrl(movie.poster_path, 'poster', 'large') ?? 'https://via.placeholder.com/300x450' }}
              style={styles.poster}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noPoster}>
              <Icon name="film-outline" size={48} color={colors.text.secondary} />
              <Text style={styles.noPosterText}>No Poster</Text>
            </View>
          )}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.releaseDate}>{movie.release_date}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color={colors.rating.active} />
            <Text style={styles.rating}>{movie.vote_average?.toFixed(1) ?? '-'}</Text>
          </View>
          <View style={styles.genresContainer}>
            {movie.genres?.map((genre) => (
              <View key={genre.id} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre.name}</Text>
              </View>
            ))}
          </View>
          {movie.runtime ? (
            <Text style={styles.runtime}>
              {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
            </Text>
          ) : null}
        </View>
      </View>

      {/* UserMovie Info Section */}
      {userMovie && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Collection Info</Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.userInfoLabel}>Watched on: </Text>
            {userMovie.watchDate || '—'}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
            <Text style={styles.userInfoText}>
              <Text style={styles.userInfoLabel}>Your Rating: </Text>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Icon
                    key={i}
                    name={i < userMovie.rating ? 'star' : 'star-outline'}
                    size={20}
                    color={colors.rating.active}
                    style={{ marginRight: 2 }}
                  />
                ))}
            </Text>
          </View>
          <Text style={styles.userInfoText}>
            <Text style={styles.userInfoLabel}>Notes: </Text>
            {userMovie.notes ? userMovie.notes : '—'}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.userInfoLabel}>Saw in Theaters: </Text>
            {userMovie.sawInTheaters ? 'Yes' : 'No'}
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cast & Crew</Text>
        <Text style={styles.directorText}>Director: {director}</Text>
        <Text style={styles.castText}>Cast: {cast.join(', ')}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.actionButton,
          inCollection ? styles.removeButton : styles.addButton
        ]}
        onPress={inCollection ? handleRemoveFromCollection : handleAddToCollection}
      >
        <Icon
          name={inCollection ? 'remove-circle' : 'add-circle'}
          size={20}
          color={colors.text.primary}
        />
        <Text style={styles.actionButtonText}>
          {inCollection ? 'Remove from Collection' : 'Add to Collection'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.secondary,
  },
  posterContainer: {
    width: 100,
    height: 150,
    marginRight: spacing.md,
  },
  poster: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  noPoster: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.sm,
    backgroundColor: colors.card.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.card.border,
  },
  noPosterText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  releaseDate: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  rating: {
    marginLeft: spacing.xs,
    color: colors.text.primary,
    fontSize: typography.sizes.md,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  genreTag: {
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.round,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  genreText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.xs,
  },
  runtime: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  section: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.card.border,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  overview: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    lineHeight: 22,
  },
  directorText: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  castText: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  addButton: {
    backgroundColor: colors.primary,
  },
  removeButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: colors.text.primary,
    marginLeft: spacing.sm,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  userInfoText: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  userInfoLabel: {
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
  },
});

export default MovieDetailsScreen;