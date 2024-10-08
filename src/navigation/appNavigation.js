import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetStarted from '../screens/GetStarted';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import AdminSignIn from '../screens/AdminSignIn';
import AdminDashboard from '../screens/AdminDashboard';
import AdminCreation from '../screens/AdminCreation'; // Import the AdminCreation screen
import { isValidRoute } from './utils'; // Import the validation function
import allowedRoutes from './allowedRoutes'; // Import the allowed routes

const Stack = createNativeStackNavigator();

const navigateTo = (navigation, route) => {
  if (isValidRoute(route)) {
    navigation.navigate(route);
  } else {
    console.warn('Invalid route:', route);
    // Optionally, you can navigate to a default route or show an error screen
  }
};

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GetStarted">
        <Stack.Screen
          name="GetStarted"
          component={GetStarted}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminSignIn"
          component={AdminSignIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{ headerShown: false }}
        />

        <Stack.Screen //Add the AdminCreation screen to the stack navigator
          name="AdminCreation"
          component={AdminCreation}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
