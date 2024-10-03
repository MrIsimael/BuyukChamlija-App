/* eslint-disable-next-line no-unused-vars */
import React from 'react';
import AppNavigation from './src/navigation/appNavigation';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigation />
    </>
  );
}
