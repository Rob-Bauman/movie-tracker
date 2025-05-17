// src/screens/AddMovieScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, typography, borderRadius } from '../theme/theme';
import { UserMovie } from '../services/storage/movieStorage';
import { RootStackParamList } from '../../App';
import { useMovieContext } from '../context/MovieContext'; // <-- Import context

type AddMovieRouteProp = RouteProp<RootStackParamList, 'AddMovie'>;

const AddMovieScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<AddMovieRouteProp>();
  const { movie, credits } = route.params;

  const { addMovie } = useMovieContext(); // <-- Use context function

  // Pre-fill fields from movie details
  const [movieData, setMovieData] = useState({
    title: movie.title || '',
    year: movie.release_date ? movie.release_date.slice(0, 4) : '',
    watchDate: '',
    rating: 0,
    notes: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sawInTheaters, setSawInTheaters] = useState(false);

  // Update form data
  const handleChange = (field: string, value: string | number) => {
    setMovieData({
      ...movieData,
      [field]: value,
    });
  };

  // Set rating (1-5 stars)
  const handleRating = (rating: number) => {
    handleChange('rating', rating);
  };

  // Save movie to collection using MovieContext
  const handleSave = async () => {
    const userMovie: UserMovie = {
      id: movie.id,
      tmdbId: movie.id,
      title: movieData.title,
      year: movieData.year,
      posterPath: movie.poster_path,
      watchDate: movieData.watchDate,
      rating: movieData.rating,
      notes: movieData.notes,
      genres: movie.genres ? movie.genres.map((g) => g.name) : [],
      director: credits?.crew.find((c) => c.job === 'Director')?.name || '',
      runtime: movie.runtime ?? 0,
      addedDate: new Date().toISOString().split('T')[0],
      sawInTheaters,
    };
    await addMovie(userMovie); // <-- Use context function
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.prominentInfoGroup}>
        {movie.poster_path ? (
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w342${movie.poster_path}` }}
            style={styles.posterImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noPoster}>
            <Icon name="film-outline" size={64} color={colors.text.secondary} />
          </View>
        )}
        <Text style={styles.prominentTitle}>{movieData.title}</Text>
        <Text style={styles.prominentYear}>{movieData.year}</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Watch Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: movieData.watchDate ? colors.text.primary : colors.text.secondary }}>
            {movieData.watchDate || 'Select date'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={movieData.watchDate ? new Date(movieData.watchDate) : new Date()}
            mode="date"
            display="default"
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                const iso = selectedDate.toISOString().split('T')[0];
                handleChange('watchDate', iso);
              }
            }}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Your Rating</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => handleRating(star)}
              style={styles.starButton}
            >
              <Icon
                name={star <= movieData.rating ? 'star' : 'star-outline'}
                size={32}
                color={colors.rating.active}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={movieData.notes}
          onChangeText={(text) => handleChange('notes', text)}
          placeholder="Add your notes or review"
          placeholderTextColor={colors.text.secondary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.formGroup}>
        <View style={styles.switchRowContainer}>
          <Text style={styles.label}>Saw in Theaters</Text>
          <Switch
            value={sawInTheaters}
            onValueChange={setSawInTheaters}
            thumbColor={sawInTheaters ? colors.primary : colors.card.border}
            trackColor={{ false: colors.card.border, true: colors.primary }}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.saveButton,
            !movieData.title ? styles.saveButtonDisabled : null,
          ]}
          onPress={handleSave}
          disabled={!movieData.title}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
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
  prominentInfoGroup: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  prominentTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  prominentYear: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.card.border,
    fontSize: typography.sizes.md,
  },
  textArea: {
    minHeight: 100,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  starButton: {
    marginRight: spacing.sm,
  },
  switchRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.card.border,
  },
  cancelButtonText: {
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  saveButtonDisabled: {
    backgroundColor: colors.text.disabled,
  },
  saveButtonText: {
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  posterImage: {
    width: 120,
    height: 180,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  noPoster: {
    width: 120,
    height: 180,
    borderRadius: borderRadius.md,
    backgroundColor: colors.card.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
});

export default AddMovieScreen;