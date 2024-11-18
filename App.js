import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigation from './src/navigation/appNavigation';
import { StatusBar } from 'expo-status-bar';
import { CartProvider } from './src/context/CartContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CartProvider>
        <StatusBar style="auto" />
        <AppNavigation />
      </CartProvider>
    </GestureHandlerRootView>
  );
}
