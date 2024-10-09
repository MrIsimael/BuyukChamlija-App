import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { signInAdmin } from '../navigation/adminAuth';

const AdminSignIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [loading, setLoading] = useState(false);

  const handleAdminSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting to sign in as admin...');
      const result = await signInAdmin(email, password);
      console.log('Sign in result:', result);
      if (result.success) {
        console.log('Admin sign in successful');
        navigation.navigate('AdminDashboard');
      } else {
        console.log('Admin sign in failed:', result.error);
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.error('Unexpected error during admin sign in:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.decorativeCircles}>
        <View style={[styles.circle, styles.topLeftCircle]} />
        <View style={[styles.circle, styles.topRightCircle]} />
      </View>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Admin Sign In</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A79C9C"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!loading}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#A79C9C"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.eyeIconContainer}
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <Feather
                name={showPassword ? 'eye' : 'eye-off'}
                size={20}
                color="#A79C9C"
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleAdminSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.signInButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>
        <View style={styles.customerLinkContainer}>
          <Text style={styles.customerText}>Not an Admin? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.customerLink}>Customer</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2238',
  },
  decorativeCircles: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  circle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.1,
  },
  topLeftCircle: {
    width: 210,
    height: 210,
    borderRadius: 120,
    top: -80,
    left: 0,
    backgroundColor: '#FF724C',
  },
  topRightCircle: {
    width: 210,
    height: 210,
    borderRadius: 120,
    top: 40,
    left: -110,
    backgroundColor: '#FF724C',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 50,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A79C9C',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#A79C9C',
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    color: '#FFFFFF',
  },
  eyeIconContainer: {
    paddingRight: 15,
  },
  signInButton: {
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center', // Added to center the ActivityIndicator
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FF724C',
    height: 60, // Fixed height to prevent layout shift when switching to ActivityIndicator
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  customerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  customerText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  customerLink: {
    color: '#FF724C',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminSignIn;
