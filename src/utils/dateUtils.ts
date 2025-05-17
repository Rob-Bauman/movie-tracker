// src/utils/dateUtils.ts
// Format date from YYYY-MM-DD to more readable format
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'Unknown';

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return dateString;

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// Get YYYY-MM-DD for today
export const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Calculate time difference between dates
export const getDaysBetween = (dateString1: string, dateString2: string): number => {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);
  
  // Calculate difference in milliseconds
  const diffInMs = Math.abs(date2.getTime() - date1.getTime());
  
  // Convert to days
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
};

// Check if a date is within the last X days
export const isWithinDays = (dateString: string, days: number): boolean => {
  const today = new Date();
  const date = new Date(dateString);
  
  // Calculate difference in milliseconds
  const diffInMs = today.getTime() - date.getTime();
  
  // Convert to days
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
  return diffInDays <= days;
};

// Format minutes to hours and minutes
export const formatRuntime = (minutes: number): string => {
  if (!minutes || minutes <= 0) return 'Unknown';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}m`;
  }
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

// Get release year from date string
export const getReleaseYear = (dateString: string | undefined): string => {
  if (!dateString) return '';
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    // Try to extract a year
    const yearRegex = /\b\d{4}\b/;
    const match = dateString.match(yearRegex);
    return match ? match[0] : '';
  }
  
  return dateString.split('-')[0];
};

// Validate date format (YYYY-MM-DD)
export const isValidDateFormat = (dateString: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }
  
  // Check if it's a valid date
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export default {
  formatDate,
  getTodayDate,
  getDaysBetween,
  isWithinDays,
  formatRuntime,
  getReleaseYear,
  isValidDateFormat,
};