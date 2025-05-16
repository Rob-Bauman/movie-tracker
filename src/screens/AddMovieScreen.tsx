// src/screens/AddMovieScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography, borderRadius } from '../theme/theme';

const AddMovieScreen = () => {
  const navigation = useNavigation();
  const [movieData, setMovieData] = useState({
    title: '',
    year: '',
    watchDate: '',
    rating: 0,
    notes: '',
  });

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

  // Save movie to collection (will connect to AsyncStorage/SQLite)
  const handleSave = () => {
    console.log('Saving movie:', movieData);
    // In real implementation: save to AsyncStorage or SQLite
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Movie Title *</Text>
        <TextInput
          style={styles.input}
          value={movieData.title}
          onChangeText={(text) => handleChange('title', text)}
          placeholder="Enter movie title"
          placeholderTextColor={colors.text.secondary}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Release Year</Text>
        <TextInput
          style={styles.input}
          value={movieData.year}
          onChangeText={(text) => handleChange('year', text)}
          placeholder="Enter release year"
          placeholderTextColor={colors.text.secondary}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Watch Date</Text>
        <TextInput
          style={styles.input}
          value={movieData.watchDate}
          onChangeText={(text) => handleChange('watchDate', text)}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.text.secondary}
        />
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
});

export default AddMovieScreen;