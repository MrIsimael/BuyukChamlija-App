import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const cardPadding = 30;
const cardGap = 20;
const cardWidth = (width - 2 * cardPadding - cardGap) / 2;

const DecorativeCircles = () => (
  <View style={styles.decorativeCircles}>
    <View style={[styles.circle, styles.topLeftCircle]} />
    <View style={[styles.circle, styles.bottomRightCircle]} />
    <View style={[styles.circle, styles.sideRightCircle]} />
    <View style={[styles.circle, styles.sideRightCircle2]} />
    <View style={[styles.circle, styles.sideLeftCircle]} />
  </View>
);

const AdminDashboard = () => {
  const navigation = useNavigation();

  const dashboardItems = [
    { title: 'Sections', screen: 'AdminSections', type: 'large' },
    { title: 'Items', screen: 'AdminItems', type: 'small' },
    { title: 'Customers', screen: 'AdminCustomers', type: 'large' },
    { title: 'Vendors', screen: 'AdminVendors', type: 'small' },
    { title: 'Events', screen: null, type: 'small' },
  ];

  const renderItem = ({ item, index }) => {
    const isSmallCard = item.type === 'small';

    return (
      <TouchableOpacity
        style={[
          isSmallCard ? styles.smallDashboardItem : styles.dashboardItem,
          // Add margin styles for proper spacing
          styles.cardWrapper,
          // Adjust margins for small cards
          isSmallCard && {
            marginRight: index % 2 === 0 ? cardGap / 2 : 0,
            marginLeft: index % 2 === 1 ? cardGap / 2 : 0,
          },
        ]}
        onPress={() => {
          if (item.screen) {
            navigation.navigate(item.screen);
          } else {
            Alert.alert('Notice', 'This feature is currently unavailable.');
          }
        }}
      >
        <Text style={styles.itemTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.welcomeSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Feather name="menu" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      <FlatList
        data={dashboardItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.content}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />

      <DecorativeCircles />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  welcomeSection: {
    padding: 16,
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
  },
  container: {
    flex: 1,
    backgroundColor: '#1E2238',
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
    padding: cardPadding,
    paddingBottom: cardPadding + 20, // Add extra padding at bottom
  },
  row: {
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  cardWrapper: {
    marginBottom: 20,
    flex: 1,
  },
  dashboardItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100, // Fixed height for large cards
  },
  smallDashboardItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 25,
    width: cardWidth,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100, // Slightly smaller height for small cards
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
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

export default AdminDashboard;
