import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const AllStores = () => {
  const navigation = useNavigation();
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [productCounts, setProductCounts] = useState({});

  useEffect(() => {
    fetchStoresAndProducts();
  }, []);

  useEffect(() => {
    filterStores();
  }, [searchQuery, stores]);

  const fetchStoresAndProducts = async () => {
    try {
      // Fetch stores
      const storesQuery = query(
        collection(db, 'stores'),
        orderBy('createdAt', 'desc'),
      );
      const storesSnapshot = await getDocs(storesQuery);
      const storesData = storesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch product counts for each store
      const counts = {};
      for (const store of storesData) {
        // Try with storeId field first
        let productsQuery = query(
          collection(db, 'products'),
          where('storeId', '==', store.id),
        );
        let productsSnapshot = await getDocs(productsQuery);

        // If no products found, try with store field
        if (productsSnapshot.empty) {
          productsQuery = query(
            collection(db, 'products'),
            where('store', '==', store.id),
          );
          productsSnapshot = await getDocs(productsQuery);
        }

        counts[store.id] = productsSnapshot.size;
      }

      setProductCounts(counts);
      setStores(storesData);
      setFilteredStores(storesData);
    } catch (error) {
      console.error('Error fetching stores and products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStores = () => {
    let filtered = [...stores];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        store =>
          store.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          store.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredStores(filtered);
  };

  const renderStoreCard = store => (
    <TouchableOpacity
      key={store.id}
      style={styles.storeCard}
      onPress={() =>
        navigation.navigate('StoreProducts', {
          storeId: store.id,
          storeName: store.name,
        })
      }
    >
      <View style={styles.storeImageContainer}>
        {store.imageUrl ? (
          <Image
            source={{ uri: store.imageUrl }}
            style={styles.storeImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.storePlaceholder}>
            <Feather name="shopping-bag" size={30} color="#8F92A1" />
          </View>
        )}
        <View style={styles.viewButton}>
          <Feather name="chevron-right" size={18} color="#FF724C" />
        </View>
      </View>

      <View style={styles.storeInfo}>
        <Text style={styles.storeName}>{store.name}</Text>
        <Text style={styles.storeDescription} numberOfLines={2}>
          {store.description || 'No description available'}
        </Text>

        <View style={styles.storeStats}>
          <View style={styles.productCount}>
            <Feather name="box" size={14} color="#8F92A1" />
            <Text style={styles.statsText}>
              {productCounts[store.id] || 0} Products
            </Text>
          </View>
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
        <Text style={styles.headerTitle}>All Stores</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Feather name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Feather name="search" size={20} color="#8F92A1" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search stores..."
              placeholderTextColor="#8F92A1"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF724C" />
          </View>
        ) : filteredStores.length > 0 ? (
          <View style={styles.storesContainer}>
            {filteredStores.map(renderStoreCard)}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Feather name="shopping-bag" size={50} color="#8F92A1" />
            <Text style={styles.emptyText}>No stores found</Text>
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
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: 'white',
    fontSize: 16,
  },
  storesContainer: {
    padding: 16,
  },
  storeCard: {
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    borderRadius: 15,
    marginBottom: 16,
    overflow: 'hidden',
  },
  storeImageContainer: {
    height: 160,
    width: '100%',
    backgroundColor: '#2A2C41',
    position: 'relative',
  },
  storeImage: {
    width: '100%',
    height: '100%',
  },
  storePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3D3F54',
  },
  viewButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeInfo: {
    padding: 16,
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  storeDescription: {
    fontSize: 14,
    color: '#8F92A1',
    marginBottom: 12,
  },
  storeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  productCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    color: '#8F92A1',
    fontSize: 14,
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#8F92A1',
    fontSize: 16,
    marginTop: 16,
  },
});

export default AllStores;
