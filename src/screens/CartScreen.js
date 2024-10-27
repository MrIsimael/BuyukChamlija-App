import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Turkish Delight',
      price: 12.99,
      quantity: 2,
      stallName: 'Sweet Treats',
      stallNumber: 'A12',
    },
    {
      id: '2',
      name: 'Handmade Pottery',
      price: 45.0,
      quantity: 1,
      stallName: 'Artisan Crafts',
      stallNumber: 'B05',
    },
    {
      id: '3',
      name: 'Traditional Tea Set',
      price: 35.5,
      quantity: 1,
      stallName: 'Tea House',
      stallNumber: 'C08',
    },
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          if (newQuantity < 1) return item;
          return { ...item, quantity: newQuantity };
        }
        return item;
      }),
    );
  };

  const removeItem = id => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          onPress: () => {
            setCartItems(items => items.filter(item => item.id !== id));
          },
          style: 'destructive',
        },
      ],
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const handleCheckout = () => {
    Alert.alert(
      'Proceed to Checkout',
      'Would you like to proceed with the purchase?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Checkout',
          onPress: () => navigation.navigate('Checkout', { items: cartItems }),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Feather name="menu" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity>
          <Feather name="shopping-bag" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {cartItems.length > 0 ? (
          <>
            {cartItems.map(item => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemImagePlaceholder}>
                  <Feather name="package" size={30} color="#8F92A1" />
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.stallInfo}>
                    {item.stallName} • Stall {item.stallNumber}
                  </Text>
                  <Text style={styles.itemPrice}>£{item.price.toFixed(2)}</Text>

                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, -1)}
                    >
                      <Feather name="minus" size={18} color="#FF724C" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, 1)}
                    >
                      <Feather name="plus" size={18} color="#FF724C" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeItem(item.id)}
                    >
                      <Feather name="trash-2" size={18} color="#FF4C4C" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.summarySection}>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>
                    £{calculateTotal().toFixed(2)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Service Fee</Text>
                  <Text style={styles.summaryValue}>£2.00</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>
                    £{(calculateTotal() + 2).toFixed(2)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckout}
              >
                <Text style={styles.checkoutButtonText}>
                  Proceed to Checkout
                </Text>
                <Feather name="arrow-right" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyCart}>
            <Feather name="shopping-cart" size={64} color="#8F92A1" />
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <TouchableOpacity
              style={styles.continueShoppingButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.continueShoppingText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2C41',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
  },
  itemImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#3D3F54',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  stallInfo: {
    fontSize: 14,
    color: '#8F92A1',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF724C',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 114, 76, 0.1)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    color: 'white',
    marginHorizontal: 16,
  },
  removeButton: {
    marginLeft: 'auto',
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 76, 76, 0.1)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summarySection: {
    marginTop: 16,
    marginBottom: 32,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#8F92A1',
    fontSize: 16,
  },
  summaryValue: {
    color: 'white',
    fontSize: 16,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 12,
    marginTop: 12,
  },
  totalLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#FF724C',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#FF724C',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyCartText: {
    color: '#8F92A1',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
  },
  continueShoppingButton: {
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: '#FF724C',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;
