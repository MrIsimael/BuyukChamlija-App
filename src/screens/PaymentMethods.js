import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const PaymentMethods = ({ navigation }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().paymentMethods) {
          setPaymentMethods(userDoc.data().paymentMethods);
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      }
    }
  };

  const handleAddPaymentMethod = () => {
    // Implementation for adding new payment method
    Alert.alert(
      'Coming Soon',
      'Payment method addition will be available soon.',
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <TouchableOpacity onPress={handleAddPaymentMethod}>
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {paymentMethods.length > 0 ? (
          paymentMethods.map((method, index) => (
            <View key={index} style={styles.paymentCard}>
              <View style={styles.cardLeft}>
                <Feather name="credit-card" size={24} color="#8F92A1" />
                <View style={styles.cardDetails}>
                  <Text style={styles.cardType}>{method.type}</Text>
                  <Text style={styles.cardNumber}>
                    **** **** **** {method.lastFour}
                  </Text>
                </View>
              </View>
              <TouchableOpacity>
                <Feather name="more-vertical" size={24} color="#8F92A1" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Feather name="credit-card" size={48} color="#8F92A1" />
            <Text style={styles.emptyStateText}>No payment methods added</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddPaymentMethod}
            >
              <Text style={styles.addButtonText}>Add Payment Method</Text>
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
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    padding: 16,
    borderRadius: 15,
    marginBottom: 16,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDetails: {
    marginLeft: 16,
  },
  cardType: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardNumber: {
    color: '#8F92A1',
    fontSize: 14,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    color: '#8F92A1',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#FF724C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentMethods;
