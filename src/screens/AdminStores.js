import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import AddStoreModal from '../components/AddStoreModal';

const AdminStores = () => {
  const navigation = useNavigation();
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const storesQuery = query(
        collection(db, 'stores'),
        orderBy('createdAt', 'desc'),
      );
      const storesSnapshot = await getDocs(storesQuery);
      const storesData = storesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStores(storesData);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSuccess = () => {
    fetchStores(); // Refresh the stores list after successful creation
  };

  const renderStoreCard = store => {
    return (
      <TouchableOpacity
        key={store.id}
        style={styles.storeCard}
        onPress={() => {
          navigation.navigate('StoreDetails', {
            storeId: store.id,
            storeName: store.name,
          });
        }}
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
              <Text style={styles.statsText}>Manage Store</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.welcomeSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsModalVisible(true)}
          >
            <Feather name="plus" size={22} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Stores</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF724C" />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {stores.map(renderStoreCard)}
        </ScrollView>
      )}

      <AddStoreModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={handleModalSuccess}
      />
    </SafeAreaView>
  );
};

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
    marginLeft: 15,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default AdminStores;
