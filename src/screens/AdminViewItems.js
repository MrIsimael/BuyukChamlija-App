import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const { width } = Dimensions.get('window');
const cardPadding = 30;
const cardGap = 20;
const cardWidth = (width - 2 * cardPadding - cardGap) / 2;

const AdminViewItems = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, 'products'), orderBy('createdAt', 'desc')),
        );
        const productList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Ensure all required fields have default values
          return {
            id: doc.id,
            name: data.name || 'Unnamed Item',
            description: data.description || 'No description available',
            sellPrice: Number(data.sellPrice) || 0,
            costPrice: Number(data.costPrice) || 0,
            inStock: Number(data.inStock) || 0,
            imageUrl: data.imageUrl || null,
            createdAt: data.createdAt || new Date().toISOString(),
            ...data, // Include any other fields
          };
        });
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dashboardItem}
      onPress={() => {
        console.log('Item pressed:', item.id);
      }}
    >
      <View style={styles.noImageContainer}>
        <Feather
          name={item.imageUrl ? 'image' : 'package'}
          size={24}
          color="#8F92A1"
        />
      </View>

      <View style={styles.itemContent}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.name || 'Unnamed Item'}
        </Text>

        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.priceLabel}>Sell</Text>
            <Text style={styles.sellPrice}>
              R{(item.sellPrice || 0).toFixed(2)}
            </Text>
          </View>
          <View>
            <Text style={styles.priceLabel}>Cost</Text>
            <Text style={styles.costPrice}>
              R{(item.costPrice || 0).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.stockContainer}>
          <Text
            style={[
              styles.stockText,
              (item.inStock || 0) > 0 ? styles.inStock : styles.outOfStock,
            ]}
          >
            {(item.inStock || 0) > 0
              ? `${item.inStock} in stock`
              : 'Out of stock'}
          </Text>
        </View>

        <Text style={styles.descriptionText} numberOfLines={2}>
          {item.description || 'No description available'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          console.log('Edit item:', item.id);
        }}
      >
        <Feather name="edit" size={16} color="#FF724C" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.welcomeSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AdminCreateItem')}
          >
            <Feather name="plus" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>View Items</Text>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF724C" />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="package" size={48} color="#8F92A1" />
            <Text style={styles.emptyText}>No items found</Text>
            <Text style={styles.emptySubText}>
              Tap the + button to add your first item
            </Text>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>

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
  content: {
    flex: 1,
    padding: cardPadding,
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  dashboardItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    width: cardWidth,
    overflow: 'hidden',
    position: 'relative', // Added for edit button positioning
  },
  noImageContainer: {
    width: '100%',
    height: 100, // Reduced height
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 12,
    color: '#8F92A1',
    marginBottom: 2,
  },
  sellPrice: {
    fontSize: 16,
    color: '#FF724C',
    fontWeight: 'bold',
  },
  costPrice: {
    fontSize: 14,
    color: '#8F92A1',
  },
  stockContainer: {
    marginBottom: 8,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '500',
  },
  inStock: {
    color: '#4CAF50',
  },
  outOfStock: {
    color: '#FF5252',
  },
  descriptionText: {
    fontSize: 12,
    color: '#8F92A1',
    lineHeight: 16,
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubText: {
    color: '#8F92A1',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
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

export default AdminViewItems;
