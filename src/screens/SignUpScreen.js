import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      Alert.alert('Error', 'Please agree to the Terms and Privacy Policy');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        email: email,
        role: 'customer',
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Account created successfully', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Function to handle sign up button press

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.decorativeCircles}>
        <View style={[styles.circle, styles.topLeftCircle]} />
        <View style={[styles.circle, styles.topRightCircle]} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Sign Up</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#A79C9C"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A79C9C"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Create Password"
              placeholderTextColor="#A79C9C"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIconContainer}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Feather
                name={showPassword ? 'eye' : 'eye-off'}
                size={20}
                color="#A79C9C"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              placeholderTextColor="#A79C9C"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIconContainer}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Feather
                name={showConfirmPassword ? 'eye' : 'eye-off'}
                size={20}
                color="#A79C9C"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.termsContainer}>
          <TouchableOpacity onPress={() => setAgreeTerms(!agreeTerms)}>
            <View style={styles.checkbox}>
              {agreeTerms && <Feather name="check" size={16} color="#FF724C" />}
            </View>
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I agree with the Terms and Privacy Policy
          </Text>
        </View>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Styles for the SignUpScreen component
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
    marginBottom: 40,
    marginTop: -15,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    flexDirection: 'row',
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
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#A79C9C',
  },
  eyeIconContainer: {
    paddingRight: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    color: '#FFFFFF',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    marginTop: -20,
    marginLeft: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#FF724C',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FF724C',
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: -60,
    marginTop: -10,
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  signInLink: {
    color: '#FF724C',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
