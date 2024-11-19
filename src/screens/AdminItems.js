import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Get device width for consistent styling ST10062618
const { width } = Dimensions.get('window');
const cardPadding = 30; // Padding value for layout consistency ST10062618

// AdminItems Component ST10062618
const AdminItems = () => {
  const navigation = useNavigation(); // Hook to enable navigation between screens ST10062618

  // Navigate to a specific screen based on the passed parameter ST10062618
  const navigateTo = screen => {
    navigation.navigate(screen); // Triggers navigation to the provided screen ST10062618
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header section with back navigation ST10062618 */}
      <View style={styles.welcomeSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Items Management</Text>
      </View>

      {/* Content section with buttons for viewing and adding items ST10062618 */}
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateTo('AdminViewItems')} // Navigate to the "View Items" screen ST10062618
        >
          <Feather name="list" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>View Items</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateTo('AdminCreateItem')} // Navigate to the "Add New Item" screen ST10062618
        >
          <Feather name="plus" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Add New Item</Text>
        </TouchableOpacity>
      </View>

      {/* Decorative background circles ST10062618 */}
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

// Styles for the AdminItems screen ST10062618
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2238', // Background color for the entire screen ST10062618
  },
  welcomeSection: {
    padding: 16,
    backgroundColor: 'rgba(255, 114, 76, 0.25)', // Header background with opacity ST10062618
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28,
    marginRight: 13,
    marginLeft: 10, // Spacing for the header content ST10062618
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
    marginTop: 35,
    textAlign: 'center', // Center alignment for the header title ST10062618
  },
  content: {
    flex: 1,
    padding: cardPadding,
    marginTop: 10,
    alignItems: 'center', // Aligns buttons to the center ST10062618
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%', // Makes button width fill the container ST10062618
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10, // Spacing between icon and text ST10062618
  },
  decorativeCircles: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1, // Moves decorative circles behind other elements ST10062618
  },
  circle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100, // Makes the shapes circular ST10062618
    opacity: 0.1, // Adds transparency to the circles ST10062618
  },
  topLeftCircle: {
    bottom: 0,
    left: -100,
    backgroundColor: '#FF724C', // Sets the color for the top-left circle ST10062618
  },
  bottomRightCircle: {
    bottom: -100,
    left: 0,
    backgroundColor: '#FF724C', // Sets the color for the bottom-right circle ST10062618
  },
  SideRightCircle: {
    bottom: 100,
    right: -100,
    backgroundColor: '#FF724C', // Sets the color for the side-right circle ST10062618
  },
  SideRightCircle2: {
    bottom: 290,
    right: -100,
    backgroundColor: '#FF724C', // Sets the color for the second side-right circle ST10062618
  },
  SideLeftCircle: {
    top: 120,
    left: -100,
    backgroundColor: '#FF724C', // Sets the color for the side-left circle ST10062618
  },
});

export default AdminItems; // Exports the component for use in the app ST10062618
