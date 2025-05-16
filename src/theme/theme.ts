export const colors = {
  primary: '#E50914', // Netflix-like red
  secondary: '#221F1F', // Dark gray
  background: '#141414', // Almost black
  surface: '#221F1F', // Dark gray
  text: {
    primary: '#FFFFFF',
    secondary: '#CCCCCC',
    disabled: '#777777',
  },
  card: {
    background: '#2A2A2A',
    border: '#3A3A3A',
  },
  rating: {
    active: '#FFC107', // Gold color for active stars
    inactive: '#555555', // Gray for inactive stars
  },
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}; 

export const typography = {
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
  },
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export default {
  colors,
  spacing,
  typography,
  borderRadius,
};