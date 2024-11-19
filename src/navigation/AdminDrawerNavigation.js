import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import AdminDashboard from '../screens/AdminDashboard';
import AdminItems from '../screens/AdminItems';
import AdminCustomers from '../screens/AdminCustomers';
import AdminVendors from '../screens/AdminVendors';
import AdminStores from '../screens/AdminStores'; // Add this import

const Drawer = createDrawerNavigator();
const screenWidth = Dimensions.get('window').width;

const CustomDrawerContent = props => {
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setAdminName(userData.name || 'Admin');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setAdminName('Admin');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Logout',
          onPress: async () => {
            try {
              await signOut(auth);
              console.log('Admin logged out successfully');
              props.navigation.reset({
                index: 0,
                routes: [{ name: 'GetStarted' }],
              });
            } catch (error) {
              console.error('Error signing out: ', error);
              Alert.alert(
                'Logout Failed',
                'An error occurred while trying to log out. Please try again.',
              );
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Feather name="user" size={40} color="#FFFFFF" />
        </View>
        <Text style={styles.adminName} numberOfLines={1} ellipsizeMode="tail">
          {adminName}
        </Text>
      </View>
      <DrawerContentScrollView {...props} style={styles.drawerItemsContainer}>
        {props.state.routes.map((route, index) => {
          const { options } = props.descriptors[route.key];
          const label = options.drawerLabel || options.title || route.name;
          const isFocused = props.state.index === index;

          return (
            <TouchableOpacity
              key={route.key}
              style={[styles.drawerItem, isFocused && styles.drawerItemFocused]}
              onPress={() => props.navigation.navigate(route.name)}
            >
              {options.drawerIcon &&
                options.drawerIcon({
                  color: isFocused ? '#FF724C' : '#FFFFFF',
                  size: 24,
                })}
              <Text
                style={[
                  styles.drawerItemText,
                  isFocused && styles.drawerItemTextFocused,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </DrawerContentScrollView>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={24} color="#FF724C" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const AdminDrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#1E2238',
          width: screenWidth * 0.7,
        },
        drawerType: 'front',
        overlayColor: 'rgba(0,0,0,0.7)',
        swipeEdgeWidth: 50,
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{
          drawerIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
          drawerLabel: 'Dashboard',
        }}
      />
      <Drawer.Screen
        name="AdminStores"
        component={AdminStores}
        options={{
          drawerIcon: ({ color }) => (
            <Feather name="shopping-bag" size={24} color={color} />
          ),
          drawerLabel: 'Stores',
        }}
      />
      <Drawer.Screen
        name="AdminItems"
        component={AdminItems}
        options={{
          drawerIcon: ({ color }) => (
            <Feather name="clipboard" size={24} color={color} />
          ),
          drawerLabel: 'Items',
        }}
      />
      <Drawer.Screen
        name="AdminCustomers"
        component={AdminCustomers}
        options={{
          drawerIcon: ({ color }) => (
            <Feather name="users" size={24} color={color} />
          ),
          drawerLabel: 'Customers',
        }}
      />
      <Drawer.Screen
        name="AdminVendors"
        component={AdminVendors}
        options={{
          drawerIcon: ({ color }) => (
            <Feather name="briefcase" size={24} color={color} />
          ),
          drawerLabel: 'Vendors',
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#1E2238',
  },
  profileSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginBottom: 10,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 40,
  },
  adminName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    marginTop: -35,
  },
  drawerItemsContainer: {
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  drawerItemFocused: {
    backgroundColor: 'rgba(255, 114, 76, 0.2)',
  },
  drawerItemText: {
    color: '#FFFFFF',
    marginLeft: 32,
    fontSize: 16,
  },
  drawerItemTextFocused: {
    color: '#FF724C',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoutText: {
    color: '#FF724C',
    marginLeft: 32,
    fontSize: 16,
  },
});

export default AdminDrawerNavigation;
