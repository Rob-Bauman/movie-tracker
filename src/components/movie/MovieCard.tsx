// src/components/movie/MovieCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';
import { RootStackParamList } from '../../../App';

// Import helper function to get image URL
import { getImageUrl } from '../../services/api/tmdbApi';

interface MovieCardProps {
  id: number;
  title: string;
  year?: string;
  posterPath?: string | null;
  rating?: number;
  genres?: string[];
  compact?: boolean;
  watchDate?: string;
}

type MovieCardNavigationProp = StackNavigationProp<RootStackParamList, 'MovieDetails'>;

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  year,
  posterPath,
  rating,
  genres,
  compact = false,
  watchDate,
}) => {
  const navigation = useNavigation<MovieCardNavigationProp>();

  const handlePress = () => {
    navigation.navigate('MovieDetails', { movieId: id });
  };

  // For compact view (used in lists)
  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compactContainer}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.compactPosterContainer}>
          {posterPath ? (
            <Image
              source={{ uri: getImageUrl(posterPath, 'poster', 'small') || undefined }}
              style={styles.compactPoster}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.compactNoPoster}>
              <Icon name="film-outline" size={20} color={colors.text.secondary} />
            </View>
          )}
        </View>
        <View style={styles.compactInfo}>
          <Text style={styles.compactTitle} numberOfLines={1}>{title}</Text>
          {year && <Text style={styles.compactYear}>{year}</Text>}
          {watchDate && (
            <Text style={styles.compactwatchDate}>Watched: {watchDate}</Text>
          )}
          {rating !== undefined && (
            <View style={styles.compactRating}>
              <Icon name="star" size={12} color={colors.rating.active} />
              <Text style={styles.compactRatingText}>{rating}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  // Full view (used in grid layouts)
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.posterContainer}>
        {posterPath ? (
          <Image
            source={{ uri: getImageUrl(posterPath, 'poster', 'medium') || undefined }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noPoster}>
            <Icon name="film-outline" size={30} color={colors.text.secondary} />
            <Text style={styles.noPosterText}>No Poster</Text>
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {year && <Text style={styles.year}>{year}</Text>}
        {watchDate && (
          <Text style={styles.watchDate}>Watched: {watchDate}</Text>
        )}
        {rating !== undefined && (
          <View style={styles.ratingContainer}>
            {Array(5).fill(0).map((_, index) => (
              <Icon
                key={index}
                name={index < rating ? 'star' : 'star-outline'}
                size={16}
                color={colors.rating.active}
                style={styles.starIcon}
              />
            ))}
          </View>
        )}
        {genres && genres.length > 0 && (
          <View style={styles.genreContainer}>
            {genres.slice(0, 2).map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
            {genres.length > 2 && (
              <Text style={styles.moreGenres}>+{genres.length - 2}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Full view styles
  container: {
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.card.border,
    width: '100%',
    marginBottom: spacing.md,
  },
  posterContainer: {
    height: 200,
    width: '100%',
    backgroundColor: colors.secondary,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  noPoster: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
  },
  noPosterText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  infoContainer: {
    padding: spacing.md,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  year: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  starIcon: {
    marginRight: 2,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreTag: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  genreText: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  moreGenres: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    alignSelf: 'center',
  },
  watchDate: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },

  // Compact view styles
  compactContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.card.border,
  },
  compactPosterContainer: {
    width: 50,
    height: 75,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  compactPoster: {
    width: '100%',
    height: '100%',
  },
  compactNoPoster: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  compactTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  compactYear: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  compactwatchDate: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  compactRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactRatingText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
});

export default MovieCard;