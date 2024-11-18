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
  KeyboardAvoidingView,
  Platform,
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
} from 'firebase/firestore';
import { db, auth } from '../firebase';

const { width, height } = Dimensions.get('window');
const cardPadding = 30;

const AdminCreateItem = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [inStock, setInStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStalls, setIsLoadingStalls] = useState(true);
  const [stalls, setStalls] = useState([]);
  const [selectedStall, setSelectedStall] = useState(null);
  const [showStallSelector, setShowStallSelector] = useState(false);
  const [user, setUser] = useState(null);

  // Validation functions
  const validateName = text => {
    return /^[A-Za-z\s]+$/.test(text); // Only letters and spaces
  };

  const formatPrice = text => {
    // Remove all non-numeric characters except decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) return parts[0] + '.' + parts[1];
    // Format to 2 decimal places if there's a decimal point
    if (parts.length === 2) return parts[0] + '.' + parts[1].slice(0, 2);
    return cleaned;
  };

  // Input handlers
  const handleNameChange = text => {
    if (validateName(text) || text === '') {
      setName(text);
    }
  };

  const handleCostPriceChange = text => {
    const formatted = formatPrice(text);
    setCostPrice(formatted);
  };

  const handleSellPriceChange = text => {
    const formatted = formatPrice(text);
    setSellPrice(formatted);
  };

  const handleStockChange = text => {
    // Only allow positive integers
    const formatted = text.replace(/[^0-9]/g, '');
    setInStock(formatted);
  };

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

  // Fetch all stalls
  const fetchStalls = useCallback(async () => {
    if (!auth.currentUser) {
      console.log('No user authenticated');
      return;
    }

    try {
      setIsLoadingStalls(true);
      const stallsRef = collection(db, 'stalls');
      const stallsQuery = query(stallsRef, orderBy('stallNumber', 'asc'));
      const querySnapshot = await getDocs(stallsQuery);

      if (querySnapshot.empty) {
        setStalls([]);
        return;
      }

      const stallsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStalls(stallsData);
    } catch (error) {
      console.error('Error fetching stalls:', error);
      Alert.alert('Error', 'Failed to load stalls: ' + error.message);
    } finally {
      setIsLoadingStalls(false);
    }
  }, []);

  useEffect(() => {
    fetchStalls();
  }, [fetchStalls]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateItem = useCallback(async () => {
    if (
      !name.trim() ||
      !costPrice ||
      !sellPrice ||
      !inStock ||
      !description.trim()
    ) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!selectedStall) {
      Alert.alert('Error', 'Please select a stall for this item');
      return;
    }

    if (parseFloat(sellPrice) < parseFloat(costPrice)) {
      Alert.alert('Error', 'Selling price cannot be less than cost price');
      return;
    }

    setIsLoading(true);

    try {
      const docRef = await addDoc(collection(db, 'products'), {
        name: name.trim(),
        description: description.trim(),
        costPrice: parseFloat(costPrice),
        sellPrice: parseFloat(sellPrice),
        inStock: parseInt(inStock, 10),
        imageUrl: imageUrl.trim(),
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser ? auth.currentUser.uid : 'unknown',
        stallId: selectedStall.id,
        sectionId: selectedStall.sectionId,
        vendorId: selectedStall.vendorId || null,
      });

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
    description,
    costPrice,
    sellPrice,
    inStock,
    imageUrl,
    selectedStall,
    navigation,
  ]);

  const renderStallSelector = () => (
    <Modal
      visible={showStallSelector}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowStallSelector(false)}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.stallSelectorContent]}>
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
                Please create stalls first
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.stallList}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.stallListContent}
            >
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.welcomeSection}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel}>
              <Feather name="x" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>Create New Item</Text>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={true}
          bounces={true}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.stallSelectorButton}
            onPress={() => setShowStallSelector(true)}
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
              placeholder="Item Name (letters only)"
              placeholderTextColor="#8F92A1"
              value={name}
              onChangeText={handleNameChange}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              placeholderTextColor="#8F92A1"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Cost Price (R)"
              placeholderTextColor="#8F92A1"
              keyboardType="decimal-pad"
              value={costPrice}
              onChangeText={handleCostPriceChange}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Selling Price (R)"
              placeholderTextColor="#8F92A1"
              keyboardType="decimal-pad"
              value={sellPrice}
              onChangeText={handleSellPriceChange}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Stock Quantity"
              placeholderTextColor="#8F92A1"
              keyboardType="number-pad"
              value={inStock}
              onChangeText={handleStockChange}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E2238',
  },
  container: {
    flex: 1,
    backgroundColor: '#1E2238',
  },
  welcomeSection: {
    padding: 16,
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    zIndex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
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
    paddingHorizontal: cardPadding,
    paddingTop: 20,
    paddingBottom: 40,
  },
  contentContainer: {
    paddingBottom: 100,
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
    minHeight: 50,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
    paddingBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 30,
    paddingHorizontal: 5,
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
    backgroundColor: '#6c757d',
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
    pointerEvents: 'none',
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
    minHeight: 50,
  },
  stallSelectorLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  stallSelectorContent: {
    backgroundColor: '#1E2238',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxHeight: height * 0.7,
  },
  stallList: {
    maxHeight: height * 0.5,
  },
  stallListContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  noStallsSubtext: {
    color: '#8F92A1',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
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
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
  },
});
export default AdminCreateItem;
