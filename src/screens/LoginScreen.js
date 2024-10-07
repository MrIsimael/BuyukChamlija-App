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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Check if the user is a customer
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      if (userData && userData.role === 'customer') {
        navigation.navigate('Home');
      } else {
        // If not a customer, sign out and show an error
        await auth.signOut();
        Alert.alert(
          'Error',
          'This account is not authorized to use the mobile app.',
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.decorativeCircles}>
        <View style={[styles.circle, styles.topLeftCircle]} />
        <View style={[styles.circle, styles.topRightCircle]} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Sign In</Text>
        <View style={styles.inputContainer}>
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
              placeholder="Password"
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
        </View>
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    marginBottom: 70,
    marginTop: 50,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: -20,
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
    marginBottom: 58.5,
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 40,
    marginRight: 10,
    marginTop: -30,
  },
  forgotPasswordText: {
    color: '#FF724C',
    fontSize: 16.5,
  },
  signInButton: {
    backgroundColor: 'rgba(255, 114, 76, 0.25)', // #FF724C with 25% opacity
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FF724C',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  signUpText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  signUpLink: {
    color: '#FF724C',
    fontSize: 18,
    fontWeight: 'bold',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#FFFFFF',
    opacity: 0.3,
  },
  separatorText: {
    color: '#FFFFFF',
    paddingHorizontal: 10,
    fontSize: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
