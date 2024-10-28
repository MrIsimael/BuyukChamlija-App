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
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db, auth } from '../firebase';

const { width } = Dimensions.get('window');

const ItemDetails = ({ route, navigation }) => {
  const { itemId, stallId } = route.params;
  const [item, setItem] = useState(null);
  const [stall, setStall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchItemAndStallDetails();
    checkIfItemIsSaved();
  }, [itemId, stallId]);

  const fetchItemAndStallDetails = async () => {
    try {
      const itemDoc = await getDoc(doc(db, 'items', itemId));
      const stallDoc = await getDoc(doc(db, 'stalls', stallId));

      if (itemDoc.exists() && stallDoc.exists()) {
        setItem({ id: itemDoc.id, ...itemDoc.data() });
        setStall({ id: stallDoc.id, ...stallDoc.data() });
      }
    } catch (error) {
      console.error('Error fetching details:', error);
      Alert.alert('Error', 'Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  const checkIfItemIsSaved = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const savedItems = userDoc.data().savedItems || [];
          setIsSaved(savedItems.includes(itemId));
        }
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    }
  };

  const toggleSaveItem = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to save items');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        savedItems: isSaved ? arrayRemove(itemId) : arrayUnion(itemId),
      });
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error toggling save:', error);
      Alert.alert('Error', 'Failed to update saved items');
    }
  };

  const addToCart = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to add items to cart');
      return;
    }

    try {
      const cartRef = doc(db, 'carts', user.uid);
      const cartDoc = await getDoc(cartRef);

      const cartItem = {
        itemId,
        stallId,
        quantity,
        price: item.price,
        name: item.name,
        image: item.imageUrl,
      };

      if (cartDoc.exists()) {
        await updateDoc(cartRef, {
          items: arrayUnion(cartItem),
        });
      }

      Alert.alert('Success', 'Item added to cart');
      navigation.navigate('Cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  const adjustQuantity = increment => {
    const newQuantity = quantity + increment;
    if (newQuantity > 0 && newQuantity <= (item?.stockQuantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF724C" />
      </View>
    );
  }

  if (!item || !stall) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Item not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSaveItem}>
            <Feather
              name={isSaved ? 'heart' : 'heart'}
              size={24}
              color={isSaved ? '#FF724C' : 'white'}
              style={isSaved && styles.savedIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Item Image */}
        <View style={styles.imageContainer}>
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.itemImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="image" size={50} color="#8F92A1" />
            </View>
          )}
        </View>

        {/* Item Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>€{item.price?.toFixed(2)}</Text>

          {/* Stall Info */}
          <TouchableOpacity
            style={styles.stallInfo}
            onPress={() => navigation.navigate('StallDetails', { stallId })}
          >
            <View style={styles.stallLeft}>
              <Feather name="shopping-bag" size={20} color="#8F92A1" />
              <Text style={styles.stallName}>{stall.name}</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#8F92A1" />
          </TouchableOpacity>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>

          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => adjustQuantity(-1)}
              >
                <Feather name="minus" size={20} color="white" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => adjustQuantity(1)}
              >
                <Feather name="plus" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stock Status */}
          <View style={styles.stockContainer}>
            <Feather
              name="package"
              size={20}
              color={item.stockQuantity > 0 ? '#4CAF50' : '#FF4C4C'}
            />
            <Text
              style={[
                styles.stockText,
                { color: item.stockQuantity > 0 ? '#4CAF50' : '#FF4C4C' },
              ]}
            >
              {item.stockQuantity > 0
                ? `${item.stockQuantity} items in stock`
                : 'Out of stock'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.bottomContainer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>
            €{(item.price * quantity).toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            (!item.stockQuantity || item.stockQuantity === 0) &&
              styles.disabledButton,
          ]}
          onPress={addToCart}
          disabled={!item.stockQuantity || item.stockQuantity === 0}
        >
          <Feather name="shopping-cart" size={20} color="white" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2C41',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2C41',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2C41',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
  },
  savedIcon: {
    transform: [{ scale: 1.1 }],
  },
  imageContainer: {
    width: width,
    height: width * 0.8,
    backgroundColor: '#3D3F54',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3D3F54',
  },
  detailsContainer: {
    padding: 16,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 20,
    color: '#FF724C',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  stallInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    padding: 12,
    borderRadius: 15,
    marginBottom: 24,
  },
  stallLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stallName: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  description: {
    color: '#8F92A1',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  quantityContainer: {
    marginBottom: 24,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    borderRadius: 15,
    padding: 8,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 114, 76, 0.5)',
    borderRadius: 18,
  },
  quantityText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 24,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  stockText: {
    fontSize: 16,
    marginLeft: 8,
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    color: 'white',
    fontSize: 18,
  },
  totalPrice: {
    color: '#FF724C',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: '#FF724C',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 25,
  },
  disabledButton: {
    backgroundColor: '#8F92A1',
    opacity: 0.5,
  },
  addToCartText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ItemDetails;
