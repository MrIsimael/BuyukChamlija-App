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

const Addresses = ({ navigation }) => {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().addresses) {
          setAddresses(userDoc.data().addresses);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    }
  };

  const handleAddAddress = () => {
    // Implementation for adding new address
    Alert.alert('Coming Soon', 'Address addition will be available soon.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <TouchableOpacity onPress={handleAddAddress}>
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {addresses.length > 0 ? (
          addresses.map((address, index) => (
            <View key={index} style={styles.addressCard}>
              <View style={styles.addressLeft}>
                <Feather name="map-pin" size={24} color="#8F92A1" />
                <View style={styles.addressDetails}>
                  <Text style={styles.addressType}>{address.type}</Text>
                  <Text style={styles.addressText}>{address.fullAddress}</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Feather name="more-vertical" size={24} color="#8F92A1" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Feather name="map-pin" size={48} color="#8F92A1" />
            <Text style={styles.emptyStateText}>No addresses added</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddAddress}
            >
              <Text style={styles.addButtonText}>Add Address</Text>
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
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    padding: 16,
    borderRadius: 15,
    marginBottom: 16,
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressDetails: {
    marginLeft: 16,
    flex: 1,
  },
  addressType: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressText: {
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

export default Addresses;
