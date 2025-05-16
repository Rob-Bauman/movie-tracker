// src/screens/MovieDetailsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography, borderRadius } from '../theme/theme';

// Import types
import { RootStackParamList } from '../../App';

type MovieDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MovieDetails'>;
type MovieDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MovieDetails'>;

type Props = {
  route: MovieDetailsScreenRouteProp;
  navigation: MovieDetailsScreenNavigationProp;
};

// Placeholder movie data (this will be replaced with API data)
const placeholderMovie = {
  id: 123,
  title: 'Sample Movie Title',
  releaseDate: '2023-05-15',
  runtime: 120,
  overview: 'This is a placeholder description for a movie. It will be replaced with actual movie data from the TMDB API when implemented. This overview provides a brief summary of the movie plot and other relevant information.',
  genres: ['Action', 'Adventure', 'Sci-Fi'],
  voteAverage: 8.5,
  posterPath: null,
  director: 'Director Name',
  cast: ['Actor 1', 'Actor 2', 'Actor 3'],
  inUserCollection: false,
};

const MovieDetailsScreen = ({ route, navigation }: Props) => {
  const { movieId } = route.params;
  // In the real implementation, fetch movie details using movieId
  
  // Placeholder for adding to collection functionality
  const handleAddToCollection = () => {
    console.log('Add to collection:', movieId);
    // Will be implemented with AsyncStorage or SQLite
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.posterContainer}>
          {placeholderMovie.posterPath ? (
            <Image
              source={{ uri: 'https://via.placeholder.com/300x450' }}
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
          <Text style={styles.title}>{placeholderMovie.title}</Text>
          <Text style={styles.releaseDate}>{placeholderMovie.releaseDate}</Text>
          
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color={colors.rating.active} />
            <Text style={styles.rating}>{placeholderMovie.voteAverage.toFixed(1)}</Text>
          </View>
          
          <View style={styles.genresContainer}>
            {placeholderMovie.genres.map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.runtime}>
            {Math.floor(placeholderMovie.runtime / 60)}h {placeholderMovie.runtime % 60}m
          </Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.overview}>{placeholderMovie.overview}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cast & Crew</Text>
        <Text style={styles.directorText}>Director: {placeholderMovie.director}</Text>
        <Text style={styles.castText}>Cast: {placeholderMovie.cast.join(', ')}</Text>
      </View>
      
      <TouchableOpacity
        style={[
          styles.actionButton,
          placeholderMovie.inUserCollection ? styles.removeButton : styles.addButton
        ]}
        onPress={handleAddToCollection}
      >
        <Icon
          name={placeholderMovie.inUserCollection ? 'remove-circle' : 'add-circle'}
          size={20}
          color={colors.text.primary}
        />
        <Text style={styles.actionButtonText}>
          {placeholderMovie.inUserCollection ? 'Remove from Collection' : 'Add to Collection'}
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
});

export default MovieDetailsScreen;