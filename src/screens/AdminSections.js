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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db, auth } from '../firebase';

const { width } = Dimensions.get('window');
const cardPadding = 30;

const AdminSections = () => {
  const navigation = useNavigation();
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Start with true
  const [isSubmitting, setIsSubmitting] = useState(false); // Separate loading state for submissions
  const [modalVisible, setModalVisible] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionDescription, setNewSectionDescription] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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

  // Fetch existing sections
  const fetchSections = useCallback(async () => {
    if (!auth.currentUser) return;

    try {
      const sectionsQuery = query(
        collection(db, 'sections'),
        orderBy('createdAt', 'desc'),
      );
      const querySnapshot = await getDocs(sectionsQuery);
      const sectionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSections(sectionsData);
    } catch (error) {
      console.error('Error fetching sections:', error);
      Alert.alert(
        'Error',
        'Failed to load sections. Please check your connection and try again.',
      );
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  // Use useFocusEffect to refresh data when screen is focused
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        const isAdminUser = await checkAdminStatus();
        if (isAdminUser && isActive) {
          setIsLoading(true);
          await fetchSections();
        }
      };

      loadData();

      return () => {
        isActive = false;
      };
    }, [checkAdminStatus, fetchSections]),
  );

  const handleCreateSection = useCallback(async () => {
    if (!auth.currentUser || !isAdmin) {
      Alert.alert(
        'Error',
        'You must be logged in as an admin to perform this action',
      );
      return;
    }

    if (!newSectionName.trim()) {
      Alert.alert('Error', 'Please enter a section name');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'sections'), {
        name: newSectionName.trim(),
        description: newSectionDescription.trim(),
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser.uid,
        stallCount: 0,
        active: true,
      });

      setModalVisible(false);
      setNewSectionName('');
      setNewSectionDescription('');
      fetchSections();
      Alert.alert('Success', 'Section created successfully');
    } catch (error) {
      console.error('Error creating section:', error);
      Alert.alert(
        'Error',
        'Failed to create section. Please check your connection and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [newSectionName, newSectionDescription, fetchSections, isAdmin]);

  const renderSection = section => (
    <TouchableOpacity
      key={section.id}
      style={styles.sectionCard}
      onPress={() =>
        navigation.navigate('AdminStalls', { sectionId: section.id })
      }
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionName}>{section.name}</Text>
        <Text style={styles.stallCount}>{section.stallCount} Stalls</Text>
      </View>
      {section.description && (
        <Text style={styles.sectionDescription}>{section.description}</Text>
      )}
    </TouchableOpacity>
  );

  // Loading Screen
  if (isInitialLoad || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.welcomeSection}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>Sections</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF724C" />
          <Text style={styles.loadingText}>Loading sections...</Text>
        </View>
        <View style={styles.decorativeCircles}>
          <View style={[styles.circle, styles.topLeftCircle]} />
          <View style={[styles.circle, styles.bottomRightCircle]} />
          <View style={[styles.circle, styles.sideRightCircle]} />
          <View style={[styles.circle, styles.sideRightCircle2]} />
          <View style={[styles.circle, styles.sideLeftCircle]} />
        </View>
      </SafeAreaView>
    );
  }

  if (!isAdmin) {
    return null;
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
        <Text style={styles.headerTitle}>Sections</Text>
      </View>

      <ScrollView style={styles.content}>
        {sections.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.noSections}>No sections found</Text>
            <Text style={styles.noSectionsSubtext}>
              Tap the + button to create a new section
            </Text>
          </View>
        ) : (
          sections.map(renderSection)
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
            <Text style={styles.modalTitle}>Create New Section</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Section Name"
                placeholderTextColor="#8F92A1"
                value={newSectionName}
                onChangeText={setNewSectionName}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description (optional)"
                placeholderTextColor="#8F92A1"
                value={newSectionDescription}
                onChangeText={setNewSectionDescription}
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
                onPress={handleCreateSection}
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
  noSections: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noSectionsSubtext: {
    color: '#8F92A1',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
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
  sectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stallCount: {
    fontSize: 14,
    color: '#8F92A1',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#8F92A1',
    marginTop: 5,
  },
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
  sideRightCircle: {
    bottom: 100,
    right: -100,
    backgroundColor: '#FF724C',
  },
  sideRightCircle2: {
    bottom: 290,
    right: -100,
    backgroundColor: '#FF724C',
  },
  sideLeftCircle: {
    top: 120,
    left: -100,
    backgroundColor: '#FF724C',
  },
});

export default AdminSections;
