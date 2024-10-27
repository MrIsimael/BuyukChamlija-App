// src/navigation/appNavigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

// Import existing screens
import GetStarted from '../screens/GetStarted';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import AdminCreation from '../screens/AdminCreation';
import AdminDrawerNavigation from './AdminDrawerNavigation';
import AdminViewItems from '../screens/AdminViewItems';
import AdminCreateItem from '../screens/AdminCreateItem';
import AdminCustomers from '../screens/AdminCustomers';
import AdminVendors from '../screens/AdminVendors';
import ForgotPassword from '../screens/ForgotPassword';
import AdminSections from '../screens/AdminSections';
import AdminStalls from '../screens/AdminStalls';
import { isValidRoute } from './utils';
import allowedRoutes from './allowedRoutes';
import { createContext, useContext, useState, useEffect } from 'react';

const Stack = createNativeStackNavigator();
const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              role: userData.role,
            });
            await AsyncStorage.setItem('userRole', userData.role);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
        await AsyncStorage.multiRemove(['userRole', 'userEmail', 'rememberMe']);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Enhanced navigation helper with auth checks
const navigateTo = (navigation, route, params = {}, user) => {
  if (!isValidRoute(route)) {
    console.warn('Invalid route:', route);
    return;
  }

  // Check if route is allowed for current user
  const isAuthRoute = [
    'GetStarted',
    'Login',
    'SignUp',
    'ForgotPassword',
  ].includes(route);
  const isAdminRoute = route.startsWith('Admin');

  if (user) {
    // Logged in user trying to access auth routes
    if (isAuthRoute) {
      console.warn('Authenticated users cannot access auth routes');
      return;
    }

    // Non-admin trying to access admin routes
    if (isAdminRoute && user.role !== 'admin') {
      console.warn('Unauthorized access to admin route');
      return;
    }
  } else {
    // Non-authenticated user trying to access protected routes
    if (!isAuthRoute) {
      navigation.navigate('Login');
      return;
    }
  }

  if (isAdminRoute && route !== 'AdminCreation') {
    navigation.navigate('AdminDrawer', { screen: route, params });
  } else {
    navigation.navigate(route, params);
  }
};

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  const screenOptions = {
    headerShown: false,
    gestureEnabled: false, // Disable swipe gestures globally
  };

  return (
    <Stack.Navigator
      initialRouteName={
        user ? (user.role === 'admin' ? 'AdminDrawer' : 'Home') : 'GetStarted'
      }
      screenOptions={screenOptions}
    >
      {!user ? (
        // Auth Stack
        <>
          <Stack.Screen name="GetStarted" component={GetStarted} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </>
      ) : (
        // Protected Stack
        <>
          {user.role === 'admin' ? (
            <>
              <Stack.Screen
                name="AdminDrawer"
                component={AdminDrawerNavigation}
              />
              <Stack.Screen name="AdminViewItems" component={AdminViewItems} />
              <Stack.Screen
                name="AdminCreateItem"
                component={AdminCreateItem}
              />
              <Stack.Screen name="AdminCustomers" component={AdminCustomers} />
              <Stack.Screen name="AdminVendors" component={AdminVendors} />
              <Stack.Screen name="AdminSections" component={AdminSections} />
              <Stack.Screen name="AdminStalls" component={AdminStalls} />
            </>
          ) : (
            <Stack.Screen name="Home" component={HomeScreen} />
          )}
        </>
      )}
      {/* Special case for admin creation - accessible without auth */}
      <Stack.Screen name="AdminCreation" component={AdminCreation} />
    </Stack.Navigator>
  );
};

export default function AppNavigation() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

// Export the enhanced navigateTo function
export { navigateTo };
