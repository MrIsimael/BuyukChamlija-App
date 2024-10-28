import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebase';

const SavedItems = ({ navigation }) => {
  const [savedItems, setSavedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSavedItems();
  }, []);

  const fetchSavedItems = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const savedItemsQuery = query(
          collection(db, 'savedItems'),
          where('userId', '==', user.uid),
        );

        const querySnapshot = await getDocs(savedItemsQuery);
        const itemsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSavedItems(itemsData);
      }
    } catch (error) {
      console.error('Error fetching saved items:', error);
      Alert.alert('Error', 'Failed to load saved items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = itemId => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your saved items?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'savedItems', itemId));
              setSavedItems(prev => prev.filter(item => item.id !== itemId));
              Alert.alert('Success', 'Item removed from saved items');
            } catch (error) {
              console.error('Error removing item:', error);
              Alert.alert('Error', 'Failed to remove item. Please try again.');
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handleAddToCart = async item => {
    try {
      // Add to cart logic here
      // You'll need to implement this based on your cart structure
      Alert.alert('Success', 'Item added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  const renderSavedItem = item => (
    <View key={item.id} style={styles.itemCard}>
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
      >
        <View style={styles.itemImageContainer}>
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.itemImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="image" size={30} color="#8F92A1" />
            </View>
          )}
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item.id)}
          >
            <Feather name="x" size={20} color="#FF4C4C" />
          </TouchableOpacity>
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.stallInfo}>
            {item.stallName} • Stall {item.stallNumber}
          </Text>

          <View style={styles.itemFooter}>
            <Text style={styles.price}>£{item.price.toFixed(2)}</Text>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => handleAddToCart(item)}
            >
              <Feather name="shopping-cart" size={16} color="#FFFFFF" />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Items</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF724C" />
        </View>
      ) : savedItems.length > 0 ? (
        <ScrollView style={styles.content}>
          {savedItems.map(renderSavedItem)}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Feather name="heart" size={64} color="#8F92A1" />
          </View>
          <Text style={styles.emptyText}>Your saved items list is empty</Text>
          <Text style={styles.emptySubtext}>
            Items you save will appear here
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.exploreButtonText}>Explore Items</Text>
          </TouchableOpacity>
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
  itemCard: {
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    borderRadius: 15,
    marginBottom: 16,
    overflow: 'hidden',
  },
  itemContent: {
    flexDirection: 'row',
    padding: 12,
  },
  itemImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#3D3F54',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  stallInfo: {
    fontSize: 14,
    color: '#8F92A1',
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF724C',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF724C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addToCartText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
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
    padding: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 114, 76, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#8F92A1',
    marginBottom: 32,
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF724C',
  },
  exploreButtonText: {
    color: '#FF724C',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SavedItems;
