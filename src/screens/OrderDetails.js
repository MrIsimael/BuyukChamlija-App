import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Share,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const OrderDetails = ({ navigation, route }) => {
  const { order } = route.params;

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const shareReceipt = async () => {
    try {
      const message = `Order Receipt\n
Transaction ID: ${order.transactionId}
Date: ${formatDate(order.timestamp)}
Items:
${order.items.map(item => `${item.name} x${item.quantity} - £${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Total Amount: £${order.totalAmount.toFixed(2)}
Payment: Card ending in ${order.paymentMethod.lastFourDigits}`;

      await Share.share({
        message,
        title: 'Order Receipt',
      });
    } catch (error) {
      console.error('Error sharing receipt:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <TouchableOpacity onPress={shareReceipt}>
          <Feather name="share-2" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Order ID:</Text>
            <Text style={styles.value}>{order.transactionId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{formatDate(order.timestamp)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Status:</Text>
            <View style={styles.statusContainer}>
              <View
                style={[styles.statusDot, { backgroundColor: '#4CAF50' }]}
              />
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>
                  £{(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.stallName}>{item.stallName}</Text>
                <Text style={styles.quantity}>Qty: {item.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentMethod}>
              <Feather name="credit-card" size={20} color="#8F92A1" />
              <Text style={styles.paymentText}>
                Card ending in {order.paymentMethod.lastFourDigits}
              </Text>
            </View>
            <Text style={styles.cardholderName}>
              {order.paymentMethod.cardholderName}
            </Text>
          </View>
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>
            £{order.totalAmount.toFixed(2)}
          </Text>
        </View>
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
  section: {
    backgroundColor: 'rgba(255, 114, 76, 0.15)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    color: '#8F92A1',
    fontSize: 14,
  },
  value: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  itemCard: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 12,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  itemPrice: {
    color: '#FF724C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stallName: {
    color: '#8F92A1',
    fontSize: 14,
  },
  quantity: {
    color: '#8F92A1',
    fontSize: 14,
  },
  paymentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
  },
  cardholderName: {
    color: '#8F92A1',
    fontSize: 14,
  },
  totalSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 32,
  },
  totalLabel: {
    color: '#8F92A1',
    fontSize: 16,
    marginBottom: 8,
  },
  totalAmount: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default OrderDetails;
