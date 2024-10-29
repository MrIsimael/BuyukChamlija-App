import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);

      if (existingItem) {
        const updatedItems = currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
        Alert.alert('Success', `Updated ${product.name} quantity in cart`);
        return updatedItems;
      }

      Alert.alert('Success', `${product.name} added to cart`);
      return [...currentItems, { ...product, quantity }];
    });
  };

  const removeFromCart = productId => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          onPress: () => {
            setCartItems(currentItems =>
              currentItems.filter(item => item.id !== productId),
            );
          },
          style: 'destructive',
        },
      ],
    );
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const clearCart = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to clear your cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        onPress: () => setCartItems([]),
        style: 'destructive',
      },
    ]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.price || 0) * item.quantity,
      0,
    );
  };

  const getCartSize = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartSize,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
