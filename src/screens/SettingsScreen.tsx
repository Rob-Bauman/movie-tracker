// src/screens/SettingsScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as DocumentPicker from 'react-native-document-picker';
import * as FileSystem from 'expo-file-system';
import { colors, spacing, typography } from '../theme/theme';
import { importMoviesFromCSV } from '../services/import/csvImportService';
import { useMovieContext } from '../context/MovieContext';

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    darkMode: true, // Default to dark mode as per our theme
    notifications: false,
    dataSync: false,
    biometricAuth: false,
  });

  const { addMovie } = useMovieContext();

  // Toggle setting value
  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  // Clear all user data (will be implemented with AsyncStorage/SQLite)
  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all your movie data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: () => console.log('Clear data confirmed'),
          style: 'destructive',
        },
      ]
    );
  };

  // CSV Import Handler
  const handleImportCSV = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.csv || 'text/csv'],
        copyTo: 'cachesDirectory',
      });
      if (result && result.uri) {
        const csvString = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.UTF8 });
        const { imported, errors } = await importMoviesFromCSV(csvString);

        // Add imported movies to collection
        for (const movie of imported) {
          await addMovie(movie);
        }

        Alert.alert(
          'Import Complete',
          `Imported: ${imported.length} movies\n${errors.length ? 'Errors:\n' + errors.join('\n') : ''}`
        );
      }
    } catch (err) {
      Alert.alert('Import Failed', err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="moon-outline" size={24} color={colors.text.primary} style={styles.settingIcon} />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={settings.darkMode}
            onValueChange={() => toggleSetting('darkMode')}
            trackColor={{ false: colors.text.disabled, true: colors.primary }}
            thumbColor={colors.text.primary}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Application</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="notifications-outline" size={24} color={colors.text.primary} style={styles.settingIcon} />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={() => toggleSetting('notifications')}
            trackColor={{ false: colors.text.disabled, true: colors.primary }}
            thumbColor={colors.text.primary}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="cloud-upload-outline" size={24} color={colors.text.primary} style={styles.settingIcon} />
            <Text style={styles.settingText}>Data Synchronization</Text>
          </View>
          <Switch
            value={settings.dataSync}
            onValueChange={() => toggleSetting('dataSync')}
            trackColor={{ false: colors.text.disabled, true: colors.primary }}
            thumbColor={colors.text.primary}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="finger-print-outline" size={24} color={colors.text.primary} style={styles.settingIcon} />
            <Text style={styles.settingText}>Biometric Authentication</Text>
          </View>
          <Switch
            value={settings.biometricAuth}
            onValueChange={() => toggleSetting('biometricAuth')}
            trackColor={{ false: colors.text.disabled, true: colors.primary }}
            thumbColor={colors.text.primary}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <TouchableOpacity style={styles.dataButton} onPress={handleClearData}>
          <Icon name="trash-outline" size={24} color={colors.error} style={styles.settingIcon} />
          <Text style={styles.dataButtonText}>Clear All Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dataButton}>
          <Icon name="download-outline" size={24} color={colors.text.primary} style={styles.settingIcon} />
          <Text style={styles.dataButtonText}>Export Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dataButton}>
          <Icon name="document-text-outline" size={24} color={colors.text.primary} style={styles.settingIcon} />
          <Text style={styles.dataButtonText}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dataButton} onPress={handleImportCSV}>
          <Icon name="cloud-upload-outline" size={24} color={colors.text.primary} style={styles.settingIcon} />
          <Text style={styles.dataButtonText}>Import from CSV</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.appName}>MovieTracker</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.card.border,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.card.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: spacing.md,
  },
  settingText: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  dataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.card.border,
  },
  dataButtonText: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  aboutSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.xxl,
  },
  appName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  appVersion: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
});

export default SettingsScreen;