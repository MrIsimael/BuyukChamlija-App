import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { db, auth } from '../firebase';

const { width, height } = Dimensions.get('window');
const cardPadding = 30;

const AdminCreateItem = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [inStock, setInStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStalls, setIsLoadingStalls] = useState(true);
  const [stalls, setStalls] = useState([]);
  const [selectedStall, setSelectedStall] = useState(null);
  const [showStallSelector, setShowStallSelector] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch all stalls
  const fetchStalls = useCallback(async () => {
    if (!auth.currentUser) {
      console.log('No user authenticated');
      return;
    }

    try {
      setIsLoadingStalls(true);
      console.log('Fetching stalls as user:', auth.currentUser.uid);

      const stallsRef = collection(db, 'stalls');
      console.log('Collection reference created for stalls');

      // Add the section filter if you want to show stalls from specific sections
      const stallsQuery = query(stallsRef, orderBy('stallNumber', 'asc'));

      const querySnapshot = await getDocs(stallsQuery);
      console.log('Query snapshot size:', querySnapshot.size);

      if (querySnapshot.empty) {
        console.log('No stalls found in the database');
        setStalls([]);
        return;
      }

      const stallsData = querySnapshot.docs.map(doc => {
        const data = {
          id: doc.id,
          ...doc.data(),
        };
        console.log('Stall found:', data);
        return data;
      });

      console.log('Total stalls processed:', stallsData.length);
      setStalls(stallsData);
    } catch (error) {
      console.error('Error fetching stalls:', error);
      console.error('Error details:', error.message);
      Alert.alert('Error', 'Failed to load stalls: ' + error.message);
    } finally {
      setIsLoadingStalls(false);
    }
  }, []);

  // Add useEffect to trigger fetch on component mount
  useEffect(() => {
    console.log('Component mounted, fetching stalls...');
    fetchStalls();
  }, [fetchStalls]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log(
        'Auth state changed:',
        user ? `User logged in: ${user.uid}` : 'No user',
      );
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateItem = useCallback(async () => {
    if (!name.trim() || !category.trim() || !price || !cost || !inStock) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!selectedStall) {
      Alert.alert('Error', 'Please select a stall for this item');
      return;
    }

    setIsLoading(true);

    try {
      // Create the item
      const docRef = await addDoc(collection(db, 'products'), {
        name: name.trim(),
        category: category.trim(),
        price: parseFloat(price),
        cost: parseFloat(cost),
        inStock: parseInt(inStock, 10),
        imageUrl: imageUrl.trim(),
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser ? auth.currentUser.uid : 'unknown',
        stallId: selectedStall.id,
        sectionId: selectedStall.sectionId,
        vendorId: selectedStall.vendorId || null,
      });

      // Update stall's item count
      const stallRef = doc(db, 'stalls', selectedStall.id);
      await updateDoc(stallRef, {
        itemCount: (selectedStall.itemCount || 0) + 1,
      });

      Alert.alert('Success', 'Item created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error adding document: ', error);
      Alert.alert('Error', 'Failed to create item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [
    name,
    category,
    price,
    cost,
    inStock,
    imageUrl,
    selectedStall,
    navigation,
  ]);

  const handleCancel = () => {
    Alert.alert(
      'Cancel Creation',
      'Are you sure you want to cancel? All entered data will be lost.',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => navigation.goBack() },
      ],
    );
  };

  const renderStallSelector = () => (
    <Modal
      visible={showStallSelector}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowStallSelector(false)}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.stallSelectorContent, { maxHeight: '80%' }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Stall</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowStallSelector(false)}
            >
              <Feather name="x" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {isLoadingStalls ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF724C" />
              <Text style={styles.loadingText}>Loading stalls...</Text>
            </View>
          ) : stalls.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.noStallsText}>No stalls available</Text>
              <Text style={styles.noStallsSubtext}>
                {!auth.currentUser
                  ? 'Please log in to view stalls'
                  : 'Please create stalls in the Stalls section first'}
              </Text>
              {__DEV__ && (
                <Text style={styles.debugText}>
                  Debug Info:{'\n'}
                  Auth: {auth.currentUser ? 'Logged In' : 'No User'}
                  {'\n'}
                  Stalls Count: {stalls.length}
                  {'\n'}
                  Loading: {isLoadingStalls ? 'Yes' : 'No'}
                </Text>
              )}
            </View>
          ) : (
            <ScrollView style={styles.stallList}>
              {stalls.map(stall => (
                <TouchableOpacity
                  key={stall.id}
                  style={[
                    styles.stallOption,
                    selectedStall?.id === stall.id &&
                      styles.selectedStallOption,
                  ]}
                  onPress={() => {
                    setSelectedStall(stall);
                    setShowStallSelector(false);
                  }}
                >
                  <View>
                    <Text style={styles.stallOptionNumber}>
                      Stall {stall.stallNumber}
                    </Text>
                    <Text style={styles.stallOptionName}>{stall.name}</Text>
                    {stall.description && (
                      <Text style={styles.stallOptionDescription}>
                        {stall.description}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.welcomeSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel}>
            <Feather name="x" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Create New Item</Text>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity
          style={styles.stallSelectorButton}
          onPress={() => {
            console.log('Opening stall selector');
            console.log('Current stalls:', stalls);
            console.log(
              'Auth state:',
              auth.currentUser ? 'Logged in' : 'Not logged in',
            );
            setShowStallSelector(true);
          }}
        >
          <View style={styles.stallSelectorButtonContent}>
            <Text style={styles.stallSelectorLabel}>
              {selectedStall
                ? `Stall ${selectedStall.stallNumber} - ${selectedStall.name}`
                : 'Select Stall'}
            </Text>
            <Feather name="chevron-down" size={20} color="#8F92A1" />
          </View>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Item Name"
            placeholderTextColor="#8F92A1"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Category"
            placeholderTextColor="#8F92A1"
            value={category}
            onChangeText={setCategory}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Price"
            placeholderTextColor="#8F92A1"
            keyboardType="decimal-pad"
            value={price}
            onChangeText={setPrice}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Cost"
            placeholderTextColor="#8F92A1"
            keyboardType="decimal-pad"
            value={cost}
            onChangeText={setCost}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="In Stock"
            placeholderTextColor="#8F92A1"
            keyboardType="number-pad"
            value={inStock}
            onChangeText={setInStock}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            placeholderTextColor="#8F92A1"
            value={imageUrl}
            onChangeText={setImageUrl}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, isLoading && styles.disabledButton]}
            onPress={handleCreateItem}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Create Item</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {renderStallSelector()}

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
    marginTop: 10,
  },
  stallInfo: {
    color: '#8F92A1',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    padding: 15,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#FF724C',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#6c757d', // A neutral color for the cancel button
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 114, 76, 0.5)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
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
  stallSelectorButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 20,
  },
  stallSelectorButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  stallSelectorLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  stallSelectorContent: {
    backgroundColor: '#1E2238',
    borderRadius: 10,
    padding: 20,
    width: width - 40,
    maxHeight: height * 0.8,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noStallsSubtext: {
    color: '#8F92A1',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  debugText: {
    color: '#FF724C',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#FF724C',
    borderRadius: 5,
  },
  stallList: {
    maxHeight: 300,
    marginVertical: 15,
  },
  stallOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  selectedStallOption: {
    backgroundColor: 'rgba(255, 114, 76, 0.2)',
    borderColor: '#FF724C',
    borderWidth: 1,
  },
  stallOptionNumber: {
    color: '#FF724C',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stallOptionName: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 4,
  },
  noStallsText: {
    color: '#8F92A1',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  stallOptionDescription: {
    color: '#8F92A1',
    fontSize: 12,
    marginTop: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
  },
});

export default AdminCreateItem;
