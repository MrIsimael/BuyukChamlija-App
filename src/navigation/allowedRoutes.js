// src/navigation/allowedRoutes.js
const allowedRoutes = {
  // Auth routes
  getStarted: 'GetStarted',
  login: 'Login',
  signUp: 'SignUp',
  forgotPassword: 'ForgotPassword',

  // Stack names
  authStack: 'AuthStack',
  adminStack: 'AdminStack',

  // Admin routes
  adminCreation: 'AdminCreation',
  adminDrawer: 'AdminDrawer',
  adminDashboard: 'AdminDashboard',
  adminViewItems: 'AdminViewItems',
  adminCreateItem: 'AdminCreateItem',
  adminCustomers: 'AdminCustomers',
  adminVendors: 'AdminVendors',
  adminSections: 'AdminSections',
  adminStalls: 'AdminStalls',

  // User routes
  home: 'Home',
  userProfile: 'UserProfile',
};

export const getRoutesByType = type => {
  switch (type) {
    case 'auth':
      return [
        allowedRoutes.getStarted,
        allowedRoutes.login,
        allowedRoutes.signUp,
        allowedRoutes.forgotPassword,
      ];
    case 'admin':
      return [
        allowedRoutes.adminCreation,
        allowedRoutes.adminDrawer,
        allowedRoutes.adminDashboard,
        allowedRoutes.adminViewItems,
        allowedRoutes.adminCreateItem,
        allowedRoutes.adminCustomers,
        allowedRoutes.adminVendors,
        allowedRoutes.adminSections,
        allowedRoutes.adminStalls,
      ];
    case 'user':
      return [allowedRoutes.home, allowedRoutes.userProfile];
    default:
      return Object.values(allowedRoutes);
  }
};

export default allowedRoutes;
