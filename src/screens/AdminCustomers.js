import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

// Main component for displaying customer list ST10062618
const AdminCustomers = () => {
  const navigation = useNavigation(); // Navigation hook for menu ST10062618
  const [customers, setCustomers] = useState([]); // State for storing customers list ST10062618
  const [loading, setLoading] = useState(true); // State for loading indicator ST10062618

  // Fetch customer data from Firestore on component mount ST10062618
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Query Firestore to get users with role 'customer' ST10062618
        const customersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'customer'),
        );

        // Get the documents from the query ST10062618
        const querySnapshot = await getDocs(customersQuery);

        // Map each document to a customer object and add to state ST10062618
        const customerList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCustomers(customerList);
      } catch (error) {
        // Handle any errors during fetch ST10062618
        console.error('Error fetching customers:', error);
      } finally {
        // Turn off loading indicator ST10062618
        setLoading(false);
      }
    };

    fetchCustomers(); // Initiate customer fetch ST10062618
  }, []);

  // Render function for each customer item in the list ST10062618
  const renderCustomerItem = ({ item }) => (
    <View style={styles.customerItem}>
      <Text style={styles.customerName}>{item.name || 'N/A'}</Text>
      <Text style={styles.customerEmail}>{item.email}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with menu button and title ST10062618 */}
      <View style={styles.welcomeSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Feather name="menu" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Customers</Text>
      </View>

      {/* Customer list or loading message based on state ST10062618 */}
      <View style={styles.content}>
        {loading ? (
          <Text style={styles.loadingText}>Loading customers...</Text>
        ) : customers.length > 0 ? (
          <FlatList
            data={customers}
            renderItem={renderCustomerItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.noCustomersContainer}>
            <Text style={styles.noCustomersText}>No customers found</Text>
          </View>
        )}
      </View>

      {/* Background decorative circles ST10062618 */}
      <View style={styles.decorativeCircles}>
        <View style={[styles.circle, styles.topLeftCircle]} />
        <View style={[styles.circle, styles.bottomRightCircle]} />
        <View style={[styles.circle, styles.SideRightCircle]} />
        <View style={[styles.circle, styles.SideRightCircle2]} />
        <View style={[styles.circle, styles.SideLeftCircle]} />
      </View>
    </SafeAreaView>
  );
};

// Styles for component layout and design ST10062618
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2238',
  },
  welcomeSection: {
    padding: 16,
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28,
    marginRight: 13,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
    marginTop: 35,
    textAlign: 'center',
  },
  listContent: {
    padding: 20,
  },
  customerItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  customerEmail: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 5,
  },
  noCustomersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCustomersText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  decorativeCircles: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  circle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.1,
  },
  topLeftCircle: {
    bottom: 0,
    left: -100,
    backgroundColor: '#FF724C',
  },
  bottomRightCircle: {
    bottom: -100,
    left: 0,
    backgroundColor: '#FF724C',
  },
  SideRightCircle: {
    bottom: 100,
    right: -100,
    backgroundColor: '#FF724C',
  },
  SideRightCircle2: {
    bottom: 290,
    right: -100,
    backgroundColor: '#FF724C',
  },
  SideLeftCircle: {
    top: 120,
    left: -100,
    backgroundColor: '#FF724C',
  },
});

export default AdminCustomers; // Export component ST10062618
