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
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../context/CartContext';

const StoreProducts = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { storeId } = route.params || {};
  const { addToCart, getCartSize } = useCart();

  const [products, setProducts] = useState([]);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    const fetchStoreAndProducts = async () => {
      console.log('Fetching for storeId:', storeId); // Debug log

      if (!storeId) {
        console.error('No storeId provided');
        setLoading(false);
        return;
      }

      try {
        // Fetch store details
        const storeRef = doc(db, 'stores', storeId);
        const storeSnapshot = await getDoc(storeRef);

        if (storeSnapshot.exists()) {
          const storeData = { id: storeSnapshot.id, ...storeSnapshot.data() };
          console.log('Store data:', storeData); // Debug log
          setStore(storeData);
        } else {
          console.log('Store not found'); // Debug log
        }

        // Fetch products
        const productsRef = collection(db, 'products');
        const productsQuery = query(
          productsRef,
          where('storeId', '==', storeId), // Try storeId field
          orderBy('createdAt', 'desc'),
        );

        const productsSnapshot = await getDocs(productsQuery);
        console.log('Products query result size:', productsSnapshot.size); // Debug log

        if (productsSnapshot.empty) {
          // If first query is empty, try with 'store' field
          const alternativeQuery = query(
            productsRef,
            where('store', '==', storeId),
            orderBy('createdAt', 'desc'),
          );
          const alternativeSnapshot = await getDocs(alternativeQuery);
          console.log(
            'Alternative query result size:',
            alternativeSnapshot.size,
          ); // Debug log

          const productsData = alternativeSnapshot.docs.map(doc => {
            const data = doc.data();
            console.log('Product data:', data); // Debug log
            return {
              id: doc.id,
              ...data,
            };
          });
          setProducts(productsData);
        } else {
          const productsData = productsSnapshot.docs.map(doc => {
            const data = doc.data();
            console.log('Product data:', data); // Debug log
            return {
              id: doc.id,
              ...data,
            };
          });
          setProducts(productsData);
        }

        // Extract unique categories
        const uniqueCategories = [
          'All',
          ...new Set(products.map(product => product.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreAndProducts();
  }, [storeId]);

  const handleAddToCart = product => {
    if (product.inStock <= 0) {
      Alert.alert('Out of Stock', 'This item is currently unavailable');
      return;
    }
    addToCart({
      ...product,
      stallName: store?.name || 'Unknown Store',
      stallNumber: storeId,
    });
  };

  const renderProductCard = product => (
    <View key={product.id} style={styles.eventCard}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>
          {product.category || 'Uncategorized'}
        </Text>
        <View
          style={[
            styles.statusBadge,
            product.inStock > 0 ? styles.activeBadge : styles.inactiveBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              product.inStock > 0 && styles.activeStatusText,
            ]}
          >
            {product.inStock > 0 ? 'In Stock' : 'Out of Stock'}
          </Text>
        </View>
      </View>

      {product.imageUrl && (
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.productImage}
          resizeMode="cover"
        />
      )}

      <Text style={styles.eventName}>{product.name || 'Unnamed Product'}</Text>
      <Text style={styles.description}>
        {product.description || 'No description available'}
      </Text>

      <View style={styles.eventDetails}>
        <View style={styles.detailItem}>
          <Feather name="tag" size={16} color="#FF724C" />
          <Text style={styles.detailText}>
            ${(product.price || 0).toFixed(2)}
          </Text>
        </View>

        {product.inStock > 0 && (
          <View style={styles.detailItem}>
            <Feather name="package" size={16} color="#FF724C" />
            <Text style={styles.detailText}>{product.inStock} available</Text>
          </View>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() =>
            navigation.navigate('ItemDetails', { itemId: product.id })
          }
        >
          <Text style={styles.detailsButtonText}>View Details</Text>
          <Feather name="arrow-right" size={18} color="#FF724C" />
        </TouchableOpacity>

        {product.inStock > 0 && (
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => handleAddToCart(product)}
          >
            <Feather name="shopping-cart" size={18} color="white" />
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter(product => product.category === selectedCategory);

  // Move the console logs here if you want to keep them
  console.log('Current products:', products);
  console.log('Selected category:', selectedCategory);
  console.log('Filtered products:', filteredProducts);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {store?.name || 'Store Products'}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart')}
          style={styles.cartIconContainer}
        >
          <Feather name="shopping-cart" size={24} color="white" />
          {getCartSize() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getCartSize()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>{store?.name || 'Products'}</Text>
        <Text style={styles.subTitle}>
          {store?.description || 'Explore our products'}
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF724C" />
          </View>
        ) : products.length > 0 ? (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 20 }}
            >
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.activeBadge,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.statusText,
                      selectedCategory === category && styles.activeStatusText,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {filteredProducts.map(renderProductCard)}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products available</Text>
          </View>
        )}

        <View style={styles.notificationSection}>
          <View style={styles.notificationCard}>
            <Feather
              name="bell"
              size={24}
              color="#FF724C"
              style={styles.notificationIcon}
            />
            <Text style={styles.notificationText}>
              Get notified when new products arrive or prices drop
            </Text>
            <TouchableOpacity style={styles.notificationButton}>
              <Text style={styles.notificationButtonText}>
                Enable Notifications
              </Text>
            </TouchableOpacity>
          </View>
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
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
  subTitle: {
    fontSize: 16,
    color: '#8F92A1',
    marginBottom: 20,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#8F92A1',
    fontSize: 16,
  },
  eventCard: {
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#FF724C',
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  inactiveBadge: {
    backgroundColor: 'rgba(255, 114, 76, 0.1)',
  },
  statusText: {
    fontSize: 12,
    color: '#FF724C',
  },
  activeStatusText: {
    color: '#4CAF50',
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#8F92A1',
    marginBottom: 16,
    lineHeight: 20,
  },
  eventDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    color: '#8F92A1',
    marginLeft: 8,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 114, 76, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  detailsButtonText: {
    color: '#FF724C',
    marginRight: 8,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 114, 76, 0.1)',
    borderRadius: 20,
    marginRight: 8,
  },
  notificationSection: {
    marginVertical: 20,
  },
  notificationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
  },
  notificationIcon: {
    marginBottom: 12,
  },
  notificationText: {
    color: '#8F92A1',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  notificationButton: {
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  notificationButtonText: {
    color: '#FF724C',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF724C',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  addToCartButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 114, 76, 0.1)',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  cartIconContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF724C',
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default StoreProducts;
