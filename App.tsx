import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import MovieDetailsScreen from './src/screens/MovieDetailsScreen';
import CollectionScreen from './src/screens/CollectionScreen';
import AddMovieScreen from './src/screens/AddMovieScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Import theme
import { colors } from './src/theme/theme';

// Define navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  MovieDetails: { movieId: number };
  AddMovie: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Collection: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Main tab navigation
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Collection') {
            iconName = focused ? 'film' : 'film-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.secondary,
          borderTopColor: colors.card.border,
        },
        headerStyle: {
          backgroundColor: colors.secondary,
        },
        headerTintColor: colors.text.primary,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Collection" component={CollectionScreen} options={{ title: 'My Movies' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

// Root navigation
const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={colors.secondary} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.secondary,
            },
            headerTintColor: colors.text.primary,
            cardStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen
            name="MainTabs"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MovieDetails"
            component={MovieDetailsScreen}
            options={{ title: 'Movie Details' }}
          />
          <Stack.Screen
            name="AddMovie"
            component={AddMovieScreen}
            options={{ title: 'Add Movie' }}
          />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
