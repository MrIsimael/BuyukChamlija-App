import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetStarted from '../screens/GetStarted';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import AdminCreation from '../screens/AdminCreation';
import AdminDrawerNavigation from './AdminDrawerNavigation';
import AdminViewItems from '../screens/AdminViewItems';
import AdminCreateItem from '../screens/AdminCreateItem';
import { isValidRoute } from './utils';
import AdminCustomers from '../screens/AdminCustomers';
import AdminVendors from '../screens/AdminVendors';
import ForgotPassword from '../screens/ForgotPassword';
import AdminSections from '../screens/AdminSections';
import AdminStalls from '../screens/AdminStalls';
import HomeDrawerNavigation from './HomeDrawerNavigation';
import SavedItems from '../screens/SavedItems';
import OrderHistory from '../screens/OrderHistory';
import PaymentMethods from '../screens/PaymentMethods';
import Addresses from '../screens/Addresses';
import Help from '../screens/Help';
import ItemDetails from '../screens/ItemDetails';
import SectionDetails from '../screens/SectionDetails';
import EditProfile from '../screens/EditProfile';
import StoreProducts from '../screens/StoreProducts';
import AllStores from '../screens/AllStores'; // Add this import
import Checkout from '../screens/Checkout';
import OrderDetails from '../screens/OrderDetails';

const Stack = createNativeStackNavigator();

const navigateTo = (navigation, route, params = {}) => {
  if (isValidRoute(route)) {
    if (
      route.startsWith('Admin') &&
      route !== 'AdminSignIn' &&
      route !== 'AdminCreation'
    ) {
      navigation.navigate('AdminDrawer', { screen: route, params });
    } else if (route === 'Home') {
      navigation.navigate('HomeDrawer');
    } else {
      navigation.navigate(route, params);
    }
  } else {
    console.warn('Invalid route:', route);
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
          name="AdminCreation"
          component={AdminCreation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminDrawer"
          component={AdminDrawerNavigation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminViewItems"
          component={AdminViewItems}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminCreateItem"
          component={AdminCreateItem}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminCustomers"
          component={AdminCustomers}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminVendors"
          component={AdminVendors}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminSections"
          component={AdminSections}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminStalls"
          component={AdminStalls}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeDrawer"
          component={HomeDrawerNavigation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SavedItems"
          component={SavedItems}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrderHistory"
          component={OrderHistory}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentMethods"
          component={PaymentMethods}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Addresses"
          component={Addresses}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Help"
          component={Help}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ItemDetails"
          component={ItemDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SectionDetails"
          component={SectionDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StoreProducts"
          component={StoreProducts}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AllStores"
          component={AllStores}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Checkout"
          component={Checkout}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrderDetails"
          component={OrderDetails}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
