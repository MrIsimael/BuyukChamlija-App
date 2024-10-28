import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { updateEmail, updatePassword } from 'firebase/auth';
import { auth, db } from '../firebase';

const EditProfile = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(prevData => ({
            ...prevData,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load user data');
      }
    }
  };

  const handleSave = async field => {
    setLoading(true);
    const user = auth.currentUser;

    try {
      const userRef = doc(db, 'users', user.uid);

      switch (field) {
        case 'name':
        case 'phone':
          await updateDoc(userRef, { [field]: userData[field] });
          break;

        case 'email':
          await updateEmail(user, userData.email);
          await updateDoc(userRef, { email: userData.email });
          break;

        case 'password':
          if (userData.newPassword !== userData.confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
          }
          await updatePassword(user, userData.newPassword);
          break;
      }

      setIsEditing(prev => ({ ...prev, [field]: false }));
      Alert.alert(
        'Success',
        `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`,
      );

      // Clear password fields after successful update
      if (field === 'password') {
        setUserData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      Alert.alert('Error', `Failed to update ${field}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const renderEditField = (field, label, icon, secure = false) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <View style={styles.fieldLabel}>
          <Feather name={icon} size={20} color="#8F92A1" />
          <Text style={styles.labelText}>{label}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (isEditing[field]) {
              handleSave(field);
            } else {
              setIsEditing(prev => ({ ...prev, [field]: true }));
            }
          }}
          disabled={loading}
        >
          <Text style={styles.editButton}>
            {isEditing[field] ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={[styles.input, !isEditing[field] && styles.disabledInput]}
        value={userData[field]}
        onChangeText={text => setUserData(prev => ({ ...prev, [field]: text }))}
        editable={isEditing[field]}
        secureTextEntry={secure}
        placeholder={`Enter ${label.toLowerCase()}`}
        placeholderTextColor="#8F92A1"
      />
    </View>
  );

  const renderPasswordSection = () => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <View style={styles.fieldLabel}>
          <Feather name="lock" size={20} color="#8F92A1" />
          <Text style={styles.labelText}>Password</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (isEditing.password) {
              handleSave('password');
            } else {
              setIsEditing(prev => ({ ...prev, password: true }));
            }
          }}
          disabled={loading}
        >
          <Text style={styles.editButton}>
            {isEditing.password ? 'Save' : 'Change'}
          </Text>
        </TouchableOpacity>
      </View>
      {isEditing.password && (
        <>
          <TextInput
            style={styles.input}
            value={userData.currentPassword}
            onChangeText={text =>
              setUserData(prev => ({ ...prev, currentPassword: text }))
            }
            secureTextEntry
            placeholder="Current password"
            placeholderTextColor="#8F92A1"
          />
          <TextInput
            style={styles.input}
            value={userData.newPassword}
            onChangeText={text =>
              setUserData(prev => ({ ...prev, newPassword: text }))
            }
            secureTextEntry
            placeholder="New password"
            placeholderTextColor="#8F92A1"
          />
          <TextInput
            style={styles.input}
            value={userData.confirmPassword}
            onChangeText={text =>
              setUserData(prev => ({ ...prev, confirmPassword: text }))
            }
            secureTextEntry
            placeholder="Confirm new password"
            placeholderTextColor="#8F92A1"
          />
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FF724C" />
          </View>
        )}

        {renderEditField('name', 'Name', 'user')}
        {renderEditField('email', 'Email', 'mail')}
        {renderEditField('phone', 'Phone', 'phone')}
        {renderPasswordSection()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2C41',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  fieldContainer: {
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  editButton: {
    color: '#FF724C',
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'rgba(143, 146, 161, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    marginTop: 8,
  },
  disabledInput: {
    opacity: 0.7,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(42, 44, 65, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default EditProfile;
