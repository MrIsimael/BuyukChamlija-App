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
import AdminVendors from './AdminVendors'; // Importing AdminVendors for the Vendors section ST10062618

// Get device width for calculating card sizes dynamically ST10062618
const { width } = Dimensions.get('window');
const cardPadding = 30; // Padding for cards ST10062618
const cardGap = 20; // Gap between cards ST10062618
const cardWidth = (width - 2 * cardPadding - cardGap) / 2; // Width for small cards ST10062618

// Main Admin Dashboard Component ST10062618
const AdminDashboard = () => {
  const navigation = useNavigation(); // Hook for navigation functionality ST10062618

  // Array of dashboard items with titles and corresponding screens ST10062618
  const dashboardItems = [
    { title: 'Sections', screen: 'AdminSections' },
    { title: 'Items', screen: 'AdminItems' },
    { title: 'Customers', screen: 'AdminCustomers' },
    { title: 'Vendors', screen: 'AdminVendors' },
    { title: 'Transactions', screen: null }, // Replace with screen when available ST10062618
    { title: 'Stalls', screen: null }, // Replace with screen when available ST10062618
  ];

  // Function to render each dashboard item ST10062618
  const renderDashboardItem = (item, index) => {
    const isSmallCard = index >= 3; // Transactions and Stalls ST10062618
    const itemStyle = isSmallCard
      ? styles.smallDashboardItem
      : styles.dashboardItem; // Style based on card size ST10062618

    return (
      <TouchableOpacity
        key={index}
        style={itemStyle}
        onPress={() => {
          if (item.screen) {
            navigation.navigate(item.screen); // Navigate to screen if available ST10062618
          }
        }}
      >
        <Text style={styles.itemTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Welcome Section for header and menu ST10062618 */}
      <View style={styles.welcomeSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Feather name="menu" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      {/* Content Section with dashboard items ST10062618 */}
      <View style={styles.content}>
        {dashboardItems.slice(0, 3).map(renderDashboardItem)} {/* Render first 3 items ST10062618 */}
        <View style={styles.smallCardsContainer}>
          {dashboardItems.slice(3).map(renderDashboardItem)} {/* Render small cards ST10062618 */}
        </View>
      </View>

      {/* Background decorative circles for visual styling ST10062618 */}
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

// Styles for layout and UI design ST10062618
const styles = StyleSheet.create({
  welcomeSection: {
    padding: 16,
    backgroundColor: 'rgba(255, 114, 76, 0.25)', // Header background ST10062618
  },
  container: {
    flex: 1,
    backgroundColor: '#1E2238', // Main background color ST10062618
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
    padding: cardPadding, // Padding around the content ST10062618
    marginTop: 10,
  },
  dashboardItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 25,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Layout for small cards ST10062618
  },
  smallDashboardItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 25,
    width: cardWidth, // Dynamic width for small cards ST10062618
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', // Item title styling ST10062618
    textAlign: 'center',
  },
  decorativeCircles: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1, // Circles positioned below content ST10062618
  },
  circle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100, // Circular shapes ST10062618
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

export default AdminDashboard; // Exporting the AdminDashboard component ST10062618
