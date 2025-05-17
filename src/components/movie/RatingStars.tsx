// src/components/movie/RatingStars.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing } from '../../theme/theme';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  editable?: boolean;
  onRatingChange?: (rating: number) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 20,
  editable = false,
  onRatingChange,
}) => {
  // Handle star press if editable
  const handlePress = (selectedRating: number) => {
    if (editable && onRatingChange) {
      // If user taps the current rating, clear it (set to 0)
      if (selectedRating === rating) {
        onRatingChange(0);
      } else {
        onRatingChange(selectedRating);
      }
    }
  };

  // Create array of stars
  const stars = Array.from({ length: maxRating }, (_, index) => {
    const starIndex = index + 1;
    const isFilled = starIndex <= rating;
    
    // Choose the right icon based on fill state
    const iconName = isFilled ? 'star' : 'star-outline';
    
    if (editable) {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => handlePress(starIndex)}
          activeOpacity={0.7}
          style={styles.starButton}
        >
          <Icon
            name={iconName}
            size={size}
            color={colors.rating.active}
          />
        </TouchableOpacity>
      );
    }
    
    return (
      <Icon
        key={index}
        name={iconName}
        size={size}
        color={colors.rating.active}
        style={styles.star}
      />
    );
  });

  return (
    <View style={styles.container}>
      {stars}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: spacing.xs,
  },
  starButton: {
    padding: spacing.xs,
    marginRight: 0,
  },
});

export default RatingStars;