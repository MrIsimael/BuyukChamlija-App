// src/ExampleComponent.js
import React from 'react';
import { Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { isValidRoute } from '../navigation/utils';

const ExampleComponent = () => {
  const navigation = useNavigation();

  const navigateTo = route => {
    if (isValidRoute(route)) {
      navigation.navigate(route);
    } else {
      console.warn('Invalid route:', route);
    }
  };

  return (
    <View>
      <Button title="Go to Home" onPress={() => navigateTo('Home')} />
      <Button title="Go to Login" onPress={() => navigateTo('Login')} />
      <Button
        title="Go to Invalid Route"
        onPress={() => navigateTo('InvalidScreen')}
      />
    </View>
  );
};

export default ExampleComponent;
