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
import { useNavigation, DrawerActions } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const cardPadding = 30;
const cardGap = 20;
const cardWidth = (width - 2 * cardPadding - cardGap) / 2;

const AdminDashboard = () => {
  const navigation = useNavigation();

  const dashboardItems = [
    {
      title: 'Stores',
      screen: 'AdminDrawer',
      params: { screen: 'AdminStores' },
      icon: 'shopping-bag',
    },
    {
      title: 'Items',
      screen: 'AdminDrawer',
      params: { screen: 'AdminItems' },
      icon: 'box',
    },
    {
      title: 'Customers',
      screen: 'AdminDrawer',
      params: { screen: 'AdminCustomers' },
      icon: 'users',
    },
    {
      title: 'Vendor',
      screen: 'AdminDrawer',
      params: { screen: 'AdminVendors' },
      icon: 'user',
    },
  ];

  const renderDashboardItem = (item, index) => {
    const isSmallCard = index >= 3;
    const itemStyle = isSmallCard
      ? styles.smallDashboardItem
      : styles.dashboardItem;

    return (
      <TouchableOpacity
        key={index}
        style={itemStyle}
        onPress={() => {
          if (item.screen) {
            navigation.navigate(item.screen, item.params);
          }
        }}
      >
        <Feather
          name={item.icon}
          size={24}
          color="#FF724C"
          style={styles.itemIcon}
        />
        <Text style={styles.itemTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.welcomeSection}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Feather name="menu" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      <View style={styles.content}>
        {dashboardItems.slice(0, 3).map(renderDashboardItem)}
        <View style={styles.smallCardsContainer}>
          {dashboardItems.slice(3).map(renderDashboardItem)}
        </View>
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
  dashboardItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 25,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
  },
  smallCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallDashboardItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 25,
    width: cardWidth,
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
  },
  itemIcon: {
    marginBottom: 15,
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
