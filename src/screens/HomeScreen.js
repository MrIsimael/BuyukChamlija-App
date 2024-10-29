import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation, DrawerActions } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const images = {
  barn: require('../../assets/barn.jpg'),
  karinja: require('../../assets/karinja.jpg'),
  student: require('../../assets/student.jpg'),
  zakaat: require('../../assets/zakaat.jpg'),
};

const Home = () => {
  const navigation = useNavigation();
  const [stores, setStores] = useState([]);
  const [storeProducts, setStoreProducts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeEvents, setActiveEvents] = useState([]);

  useEffect(() => {
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
        setStores(storesData);

        // Fetch products for each store
        const productsData = {};
        for (const store of storesData) {
          const productsQuery = query(
            collection(db, 'products'),
            where('storeId', '==', store.id),
            orderBy('createdAt', 'desc'),
          );
          const productsSnapshot = await getDocs(productsQuery);
          productsData[store.id] = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
        }
        setStoreProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoresAndProducts();
  }, []);

  useEffect(() => {
    const fetchActiveEvents = async () => {
      try {
        const eventsQuery = query(
          collection(db, 'events'),
          where('status', '==', 'active'),
          orderBy('date', 'asc'),
        );

        const eventsSnapshot = await getDocs(eventsQuery);
        if (!eventsSnapshot.empty) {
          const events = eventsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setActiveEvents(events);
        }
      } catch (error) {
        console.error('Error fetching active events:', error);
      }
    };

    fetchActiveEvents();
  }, []);

  const renderStoreCard = store => {
    const products = storeProducts[store.id] || [];
    const productCount = products.length;

    return (
      <TouchableOpacity
        key={store.id}
        style={styles.storeCard}
        onPress={() => {
          navigation.navigate('StoreProducts', {
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
              <Text style={styles.statsText}>{productCount} Products</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                store.isOpen ? styles.statusOpen : styles.statusClosed,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  store.isOpen
                    ? styles.statusTextOpen
                    : styles.statusTextClosed,
                ]}
              >
                {store.isOpen ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.welcomeSection}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Feather name="menu" size={22} color="white" />
            </TouchableOpacity>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.headerIcon}
                onPress={() => navigation.navigate('Search')}
              >
                <Feather name="search" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerIcon}
                onPress={() => navigation.navigate('Cart')}
              >
                <Feather name="shopping-cart" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerIcon}
                onPress={() => navigation.navigate('Profile')}
              >
                <Feather name="user" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.brandText}>Buyuk Chamlija</Text>
        </View>

        {/* Stores Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Feather name="shopping-bag" size={24} color="white" />
              <Text style={styles.sectionTitle}>Stores</Text>
            </View>
            <TouchableOpacity
              style={styles.viewAllContainer}
              onPress={() => navigation.navigate('AllStores')}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Feather name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF724C" />
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {stores.map(renderStoreCard)}
            </ScrollView>
          )}
        </View>

        {/* Donation Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Feather name="heart" size={24} color="white" />
              <Text style={styles.sectionTitle}>Donation</Text>
            </View>
            <TouchableOpacity
              style={styles.viewAllContainer}
              onPress={() => navigation.navigate('Donations')}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Feather name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('SponsorStudent')}
            >
              <Image
                source={images.student}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <Text style={styles.cardName}>Sponsor a Student</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('ZakaatCommitment')}
            >
              <Image
                source={images.zakaat}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <Text style={styles.cardName}>Zakaat Commitment</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Festival Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Feather name="calendar" size={24} color="white" />
              <Text style={styles.sectionTitle}>Festival Dates</Text>
            </View>
            <TouchableOpacity
              style={styles.viewAllContainer}
              onPress={() => navigation.navigate('Festival')}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Feather name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {activeEvents.length > 0 ? (
              activeEvents.map(event => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.festivalCard}
                  onPress={() =>
                    navigation.navigate('EventDetails', { eventId: event.id })
                  }
                >
                  <View style={styles.festivalCardHeader}>
                    <Text style={styles.festivalDate}>{event.date}</Text>
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>Active</Text>
                    </View>
                  </View>
                  <Text style={styles.festivalName}>{event.name}</Text>
                  {event.location && (
                    <View style={styles.festivalLocation}>
                      <Feather name="map-pin" size={14} color="#8F92A1" />
                      <Text style={styles.locationText}>{event.location}</Text>
                    </View>
                  )}
                  {event.schedule && (
                    <View style={styles.festivalTime}>
                      <Feather name="clock" size={14} color="#8F92A1" />
                      <Text style={styles.timeText}>
                        {event.schedule.startTime} - {event.schedule.endTime}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.festivalCard}>
                <Text style={styles.festivalName}>No active events</Text>
              </View>
            )}
          </ScrollView>
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
    marginTop: 28,
    marginRight: 13,
    marginLeft: 10,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 16,
  },
  welcomeSection: {
    padding: 16,
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
    marginTop: 55,
    marginLeft: 15,
  },
  brandText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 15,
  },
  section: {
    padding: 16,
    marginTop: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: 10,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: 'white',
    marginRight: 5,
  },
  storeCard: {
    width: 280,
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    borderRadius: 15,
    marginRight: 16,
    marginLeft: 10,
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
    justifyContent: 'space-between',
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusOpen: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  statusClosed: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  statusTextOpen: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
  },
  statusTextClosed: {
    color: '#F44336',
    fontSize: 12,
    fontWeight: '500',
  },
  card: {
    width: 145,
    height: 112,
    marginRight: 16,
    borderRadius: 21,
    overflow: 'hidden',
    marginLeft: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 21,
  },
  cardName: {
    marginTop: 8,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  festivalCard: {
    width: 280,
    backgroundColor: '#3D3F54',
    padding: 16,
    borderRadius: 21,
    marginRight: 16,
    marginLeft: 10,
  },
  festivalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  festivalDate: {
    fontSize: 16,
    color: 'white',
  },
  activeBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
  },
  festivalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  festivalLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    color: '#8F92A1',
    fontSize: 14,
    marginLeft: 6,
  },
  festivalTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  timeText: {
    color: '#8F92A1',
    fontSize: 14,
    marginLeft: 6,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
