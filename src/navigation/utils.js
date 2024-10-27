// src/navigation/utils.js
import allowedRoutes, { getRoutesByType } from './allowedRoutes';

export const isValidRoute = route => {
  const validRoutes = Object.values(allowedRoutes);
  if (!validRoutes.includes(route)) {
    console.warn(`Invalid route: ${route}. Valid routes are:`, validRoutes);
    return false;
  }
  return true;
};

export const getRouteType = route => {
  const authRoutes = getRoutesByType('auth');
  const adminRoutes = getRoutesByType('admin');
  const userRoutes = getRoutesByType('user');

  if (authRoutes.includes(route)) return 'auth';
  if (adminRoutes.includes(route)) return 'admin';
  if (userRoutes.includes(route)) return 'user';
  return null;
};

export const navigateTo = (navigation, route, params = {}, user) => {
  if (!isValidRoute(route)) {
    return;
  }

  const routeType = getRouteType(route);

  if (user) {
    // Logged in user
    if (routeType === 'auth') {
      console.warn('Authenticated users cannot access auth routes');
      return;
    }

    if (routeType === 'admin' && user.role !== 'admin') {
      console.warn('Unauthorized access to admin route');
      return;
    }

    if (routeType === 'admin') {
      // Special handling for admin routes
      if (route === allowedRoutes.adminCreation) {
        navigation.navigate(route, params);
      } else {
        navigation.navigate(allowedRoutes.adminStack, {
          screen: route,
          params,
        });
      }
    } else {
      navigation.navigate(route, params);
    }
  } else {
    // Not logged in
    if (routeType !== 'auth' && route !== allowedRoutes.adminCreation) {
      navigation.navigate(allowedRoutes.authStack, {
        screen: allowedRoutes.login,
        params,
      });
      return;
    }
    navigation.navigate(route, params);
  }
};

// Helper to check if a user has access to a route
export const hasRouteAccess = (route, user) => {
  const routeType = getRouteType(route);

  if (!routeType) return false;
  if (routeType === 'auth') return !user;
  if (routeType === 'admin') return user?.role === 'admin';
  return !!user;
};
