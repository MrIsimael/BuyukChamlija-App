import allowedRoutes from './allowedRoutes';

export const isValidRoute = route => {
  return Object.values(allowedRoutes).includes(route);
};
