import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
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
import CreateStallModal from '../components/CreateStallModal'; // Add this import

const { width } = Dimensions.get('window');
const cardPadding = 30;

const AdminStalls = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { sectionId } = route.params;

  const [stalls, setStalls] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [sectionDetails, setSectionDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Add this new state for form values
  const [formValues, setFormValues] = useState({
    stallNumber: '',
    stallName: '',
    description: '',
  });

  // Add this new handler for form changes
  const handleChangeValues = useCallback((field, value) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

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

  // Fetch stalls
  const fetchStalls = useCallback(async () => {
    try {
      setIsLoading(true);
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
        if (error.code === 'failed-precondition') {
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
            .sort((a, b) => {
              const numA = parseInt(a.stallNumber);
              const numB = parseInt(b.stallNumber);
              return numA - numB;
            });

          setStalls(stallsData);
          Alert.alert(
            'Notice',
            'Creating database index for optimal performance. This may take a few minutes.',
            [{ text: 'OK' }],
          );
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error fetching stalls:', error);
      Alert.alert('Error', 'Failed to load stalls. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [sectionId]);

  // Fetch vendors
  const fetchVendors = useCallback(async () => {
    try {
      const vendorsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'vendor'),
      );
      const querySnapshot = await getDocs(vendorsQuery);
      const vendorList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVendors(vendorList);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      Alert.alert('Error', 'Failed to load vendors list');
    }
  }, []);

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      const isAdminUser = await checkAdminStatus();
      if (isAdminUser) {
        await Promise.all([
          fetchSectionDetails(),
          fetchStalls(),
          fetchVendors(),
        ]);
      }
    };
    loadData();
  }, [checkAdminStatus, fetchSectionDetails, fetchStalls, fetchVendors]);

  const handleCreateStall = useCallback(async () => {
    if (!formValues.stallName.trim() || !formValues.stallNumber.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const existingStallQuery = query(
        collection(db, 'stalls'),
        where('sectionId', '==', sectionId),
        where('stallNumber', '==', formValues.stallNumber.trim()),
      );
      const existingStallSnapshot = await getDocs(existingStallQuery);

      if (!existingStallSnapshot.empty) {
        Alert.alert(
          'Error',
          'A stall with this number already exists in this section',
        );
        return;
      }

      await addDoc(collection(db, 'stalls'), {
        name: formValues.stallName.trim(),
        description: formValues.description.trim(),
        stallNumber: formValues.stallNumber.trim(),
        sectionId,
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser.uid,
        isOccupied: !!selectedVendorId,
        vendorId: selectedVendorId,
        itemCount: 0,
      });

      const sectionRef = doc(db, 'sections', sectionId);
      await updateDoc(sectionRef, {
        stallCount: (sectionDetails.stallCount || 0) + 1,
      });

      setModalVisible(false);
      setFormValues({
        stallNumber: '',
        stallName: '',
        description: '',
      });
      setSelectedVendorId(null);
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
    formValues,
    selectedVendorId,
    sectionId,
    sectionDetails,
    fetchStalls,
    fetchSectionDetails,
  ]);

  const renderStall = useCallback(
    stall => {
      const vendor = vendors.find(v => v.id === stall.vendorId);

      return (
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
          {vendor && (
            <Text style={styles.vendorName}>
              Vendor: {vendor.name || vendor.email}
            </Text>
          )}
          <View style={styles.stallFooter}>
            <Text style={styles.itemCount}>{stall.itemCount} Items</Text>
          </View>
        </TouchableOpacity>
      );
    },
    [vendors, navigation, sectionId],
  );

  const VendorSelectionModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showVendorModal}
      onRequestClose={() => setShowVendorModal(false)}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.modalContainer}
        onPress={() => setShowVendorModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.modalContent, { maxHeight: '70%' }]}
          onPress={e => e.stopPropagation()}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowVendorModal(false)}
              style={styles.closeButton}
            >
              <Feather name="x" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Vendor</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.vendorOption}
              onPress={() => {
                setSelectedVendorId(null);
                setShowVendorModal(false);
              }}
            >
              <Text style={styles.vendorOptionText}>Leave Vacant</Text>
            </TouchableOpacity>

            {vendors.map(vendor => (
              <TouchableOpacity
                key={vendor.id}
                style={styles.vendorOption}
                onPress={() => {
                  setSelectedVendorId(vendor.id);
                  setShowVendorModal(false);
                }}
              >
                <View style={styles.vendorOptionContent}>
                  <Feather
                    name="user"
                    size={20}
                    color="#8F92A1"
                    style={styles.vendorIcon}
                  />
                  <View>
                    <Text style={styles.vendorOptionText}>
                      {vendor.name || 'Unnamed Vendor'}
                    </Text>
                    <Text style={styles.vendorOptionEmail}>{vendor.email}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
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

      <CreateStallModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreateStall}
        isSubmitting={isSubmitting}
        values={formValues}
        onChangeValues={handleChangeValues}
        vendors={vendors}
        selectedVendorId={selectedVendorId}
        setShowVendorModal={setShowVendorModal}
      />
      <VendorSelectionModal />

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
  container: {
    flex: 1,
    backgroundColor: '#1E2238',
  },
  content: {
    flex: 1,
    padding: cardPadding,
    marginTop: 10,
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
  vendorName: {
    fontSize: 14,
    color: '#FF724C',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width - 40,
    maxHeight: '90%',
    backgroundColor: '#1E2238',
    borderRadius: 10,
    padding: 20,
  },
  formSection: {
    flex: 1,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
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
  vendorSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  vendorSelectorText: {
    color: '#8F92A1',
    fontSize: 16,
  },
  vendorOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  vendorOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
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
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    marginLeft: 4,
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
  vendorSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  vendorSelectorActive: {
    backgroundColor: 'rgba(255, 114, 76, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 114, 76, 0.3)',
  },
  vendorSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vendorSelectorText: {
    color: '#8F92A1',
    fontSize: 16,
    marginLeft: 10,
  },
  vendorSelectorTextActive: {
    color: '#FF724C',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  createButton: {
    backgroundColor: '#FF724C',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 114, 76, 0.5)',
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default AdminStalls;
