import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';

const OrderHistory = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatPrice = price => {
    return `R${(price || 0).toFixed(2)}`;
  };

  const fetchOrders = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(
        collection(db, 'receipts'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
      );

      const querySnapshot = await getDocs(q);
      const ordersList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore timestamp to ISO string
          timestamp:
            data.timestamp?.toDate().toISOString() || new Date().toISOString(),
        };
      });

      setOrders(ordersList);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const navigateToOrderDetails = order => {
    // Ensure all data is serializable
    const serializedOrder = {
      ...order,
      // Ensure timestamp is a string
      timestamp: order.timestamp,
      // Ensure all nested data is serializable
      items: order.items.map(item => ({
        ...item,
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),
      totalAmount: Number(order.totalAmount),
    };

    navigation.navigate('OrderDetails', { order: serializedOrder });
  };

  const OrderCard = ({ order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigateToOrderDetails(order)}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderDate}>{formatDate(order.timestamp)}</Text>
          <Text style={styles.transactionId}>{order.transactionId}</Text>
        </View>
        <Text style={styles.orderAmount}>{formatPrice(order.totalAmount)}</Text>
      </View>

      <View style={styles.orderDivider} />

      <View style={styles.orderItems}>
        {order.items.map((item, index) => (
          <Text key={index} style={styles.orderItemText}>
            {item.quantity}x {item.name}
          </Text>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.paymentMethod}>
          <Feather name="credit-card" size={16} color="#8F92A1" />
          <Text style={styles.paymentText}>
            Card ending in {order.paymentMethod.lastFourDigits}
          </Text>
        </View>
        <View style={styles.orderStatus}>
          <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.statusText}>Completed</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF724C" />
        </View>
      ) : orders.length > 0 ? (
        <ScrollView style={styles.content}>
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="shopping-bag" size={64} color="#8F92A1" />
          <Text style={styles.emptyText}>No orders yet</Text>
        </View>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    color: '#8F92A1',
    fontSize: 18,
    marginTop: 16,
  },
  orderCard: {
    backgroundColor: 'rgba(255, 114, 76, 0.15)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderDate: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionId: {
    color: '#8F92A1',
    fontSize: 14,
    marginTop: 4,
  },
  orderAmount: {
    color: '#FF724C',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 12,
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItemText: {
    color: '#8F92A1',
    fontSize: 14,
    marginBottom: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    color: '#8F92A1',
    fontSize: 14,
    marginLeft: 8,
  },
  orderStatus: {
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
  },
});

export default OrderHistory;
