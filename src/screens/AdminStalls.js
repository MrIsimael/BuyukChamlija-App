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
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, auth } from '../firebase';

const { width } = Dimensions.get('window');
const cardPadding = 30;

const AdminStalls = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { sectionId } = route.params;

  const [stalls, setStalls] = useState([]);
  const [sectionDetails, setSectionDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newStallName, setNewStallName] = useState('');
  const [newStallDescription, setNewStallDescription] = useState('');
  const [stallNumber, setStallNumber] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status
  const checkAdminStatus = useCallback(async () => {
    if (!auth.currentUser) {
      navigation.navigate('Login');
      return false;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        setIsAdmin(true);
        return true;
      } else {
        Alert.alert(
          'Access Denied',
          'Only administrators can access this section',
        );
        navigation.goBack();
        return false;
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      Alert.alert('Error', 'Failed to verify permissions');
      navigation.goBack();
      return false;
    }
  }, [navigation]);

  // Fetch section details
  const fetchStalls = useCallback(async () => {
    try {
      setIsLoading(true);

      // First attempt: Try with the compound query
      try {
        const stallsQuery = query(
          collection(db, 'stalls'),
          where('sectionId', '==', sectionId),
          orderBy('stallNumber', 'asc'),
        );
        const querySnapshot = await getDocs(stallsQuery);
        const stallsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStalls(stallsData);
      } catch (error) {
        // If the index doesn't exist yet, fall back to a simple query
        if (error.code === 'failed-precondition') {
          // Simpler query without ordering
          const simpleQuery = query(
            collection(db, 'stalls'),
            where('sectionId', '==', sectionId),
          );
          const querySnapshot = await getDocs(simpleQuery);
          const stallsData = querySnapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
            }))
            // Sort the results in memory
            .sort((a, b) => {
              const numA = parseInt(a.stallNumber);
              const numB = parseInt(b.stallNumber);
              return numA - numB;
            });

          setStalls(stallsData);

          // Show a message about index creation
          Alert.alert(
            'Notice',
            'Creating database index for optimal performance. This may take a few minutes. Some features may be limited until completion.',
            [{ text: 'OK' }],
          );
        } else {
          throw error; // Rethrow if it's not an indexing error
        }
      }
    } catch (error) {
      console.error('Error fetching stalls:', error);
      Alert.alert('Error', 'Failed to load stalls. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [sectionId]);

  const fetchSectionDetails = useCallback(async () => {
    try {
      const sectionDoc = await getDoc(doc(db, 'sections', sectionId));
      if (sectionDoc.exists()) {
        setSectionDetails(sectionDoc.data());
      } else {
        Alert.alert('Error', 'Section not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error fetching section details:', error);
      Alert.alert('Error', 'Failed to load section details');
    }
  }, [sectionId, navigation]);

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      const isAdminUser = await checkAdminStatus();
      if (isAdminUser) {
        await Promise.all([fetchSectionDetails(), fetchStalls()]);
      }
    };
    loadData();
  }, [checkAdminStatus, fetchSectionDetails, fetchStalls]);

  const handleCreateStall = useCallback(async () => {
    if (!newStallName.trim() || !stallNumber.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if stall number already exists in this section
      const existingStallQuery = query(
        collection(db, 'stalls'),
        where('sectionId', '==', sectionId),
        where('stallNumber', '==', stallNumber.trim()),
      );
      const existingStallSnapshot = await getDocs(existingStallQuery);

      if (!existingStallSnapshot.empty) {
        Alert.alert(
          'Error',
          'A stall with this number already exists in this section',
        );
        return;
      }

      // Create new stall
      await addDoc(collection(db, 'stalls'), {
        name: newStallName.trim(),
        description: newStallDescription.trim(),
        stallNumber: stallNumber.trim(),
        sectionId,
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser.uid,
        isOccupied: false,
        vendorId: null,
        itemCount: 0,
      });

      // Update section's stall count
      const sectionRef = doc(db, 'sections', sectionId);
      await updateDoc(sectionRef, {
        stallCount: (sectionDetails.stallCount || 0) + 1,
      });

      setModalVisible(false);
      setNewStallName('');
      setNewStallDescription('');
      setStallNumber('');
      fetchStalls();
      fetchSectionDetails();
      Alert.alert('Success', 'Stall created successfully');
    } catch (error) {
      console.error('Error creating stall:', error);
      Alert.alert('Error', 'Failed to create stall');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    newStallName,
    newStallDescription,
    stallNumber,
    sectionId,
    sectionDetails,
    fetchStalls,
    fetchSectionDetails,
  ]);

  const renderStall = stall => (
    <TouchableOpacity
      key={stall.id}
      style={styles.stallCard}
      onPress={() =>
        navigation.navigate('AdminItems', {
          stallId: stall.id,
          sectionId: sectionId,
        })
      }
    >
      <View style={styles.stallHeader}>
        <View style={styles.stallHeaderLeft}>
          <Text style={styles.stallNumber}>Stall {stall.stallNumber}</Text>
          <Text style={styles.stallName}>{stall.name}</Text>
        </View>
        <View style={styles.stallStatus}>
          <View
            style={[
              styles.statusIndicator,
              stall.isOccupied ? styles.occupied : styles.vacant,
            ]}
          />
          <Text style={styles.statusText}>
            {stall.isOccupied ? 'Occupied' : 'Vacant'}
          </Text>
        </View>
      </View>
      {stall.description && (
        <Text style={styles.stallDescription}>{stall.description}</Text>
      )}
      <View style={styles.stallFooter}>
        <Text style={styles.itemCount}>{stall.itemCount} Items</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.welcomeSection}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>Stalls</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF724C" />
          <Text style={styles.loadingText}>Loading stalls...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.welcomeSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Feather name="plus" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>
          {sectionDetails?.name || 'Stalls'}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {stalls.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.noStalls}>No stalls found</Text>
            <Text style={styles.noStallsSubtext}>
              Tap the + button to create a new stall
            </Text>
          </View>
        ) : (
          stalls.map(renderStall)
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Stall</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Stall Number"
                placeholderTextColor="#8F92A1"
                value={stallNumber}
                onChangeText={setStallNumber}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Stall Name"
                placeholderTextColor="#8F92A1"
                value={newStallName}
                onChangeText={setNewStallName}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description (optional)"
                placeholderTextColor="#8F92A1"
                value={newStallDescription}
                onChangeText={setNewStallDescription}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, isSubmitting && styles.disabledButton]}
                onPress={handleCreateStall}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Create</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.decorativeCircles}>
        <View style={[styles.circle, styles.topLeftCircle]} />
        <View style={[styles.circle, styles.bottomRightCircle]} />
        <View style={[styles.circle, styles.sideRightCircle]} />
        <View style={[styles.circle, styles.sideRightCircle2]} />
        <View style={[styles.circle, styles.sideLeftCircle]} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Base Container Styles
  container: {
    flex: 1,
    backgroundColor: '#1E2238',
  },
  content: {
    flex: 1,
    padding: cardPadding,
    marginTop: 10,
  },

  // Header Section Styles
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

  // Stall Card Styles
  stallCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  stallHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stallHeaderLeft: {
    flex: 1,
  },
  stallNumber: {
    fontSize: 14,
    color: '#FF724C',
    fontWeight: 'bold',
  },
  stallName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  stallDescription: {
    fontSize: 14,
    color: '#8F92A1',
    marginTop: 8,
  },
  stallFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemCount: {
    fontSize: 14,
    color: '#8F92A1',
  },

  // Status Indicator Styles
  stallStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  occupied: {
    backgroundColor: '#FF724C',
  },
  vacant: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 12,
    color: '#8F92A1',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width - 40,
    backgroundColor: '#1E2238',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },

  // Input Styles
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 15,
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

  // Button Styles
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
    backgroundColor: '#6c757d',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 114, 76, 0.5)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Loading State Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E2238',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontSize: 16,
  },

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  noStalls: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noStallsSubtext: {
    color: '#8F92A1',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },

  // Decorative Elements
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
    backgroundColor: '#FF724C',
  },
  topLeftCircle: {
    bottom: 0,
    left: -100,
  },
  bottomRightCircle: {
    bottom: -100,
    left: 0,
  },
  sideRightCircle: {
    bottom: 100,
    right: -100,
  },
  sideRightCircle2: {
    bottom: 290,
    right: -100,
  },
  sideLeftCircle: {
    top: 120,
    left: -100,
  },
});

export default AdminStalls;
