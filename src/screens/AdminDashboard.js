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

const { width } = Dimensions.get('window');
const cardPadding = 30;
const cardGap = 20;
const cardWidth = (width - 2 * cardPadding - cardGap) / 2;

const AdminDashboard = () => {
  const dashboardItems = [
    { title: 'Items' },
    { title: 'Customers' },
    { title: 'Vendors' },
    { title: 'Transactions' },
    { title: 'Stalls' },
  ];

  const renderDashboardItem = (item, index) => {
    const isSmallCard = index >= 3; // Transactions and Stalls
    const itemStyle = isSmallCard
      ? styles.smallDashboardItem
      : styles.dashboardItem;

    return (
      <TouchableOpacity key={index} style={itemStyle}>
        <Text style={styles.itemTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.welcomeSection}>
        <View style={styles.header}>
          <TouchableOpacity>
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
        <View style={[styles.circle, styles.SideRightCircle]} />
        <View style={[styles.circle, styles.SideRightCircle2]} />
        <View style={[styles.circle, styles.SideLeftCircle]} />
      </View>
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
    flex: 1,
    padding: cardPadding,
    marginTop: 10,
  },
  dashboardItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 21,
    padding: 25,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallDashboardItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 21,
    padding: 25,
    width: cardWidth,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default AdminDashboard;