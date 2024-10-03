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
import { Feather, FontAwesome } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    // Here you would typically implement your authentication logic
    // For this example, we'll just check if email and password are not empty
    if (email.trim() && password.trim()) {
      navigation.navigate('Home');
    } else {
      Alert.alert('Error', 'Please enter both email and password.');
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
        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={styles.separatorText}>Sign In with</Text>
          <View style={styles.separator} />
        </View>
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="facebook" size={24} color="#3b5998" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="linkedin" size={24} color="#0077b5" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="yahoo" size={24} color="#410093" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="google" size={24} color="#db4437" />
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
    marginBottom: 30,
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
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#FF724C',
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
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
    marginBottom: 20,
  },
  signUpText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  signUpLink: {
    color: '#FF724C',
    fontSize: 14,
    fontWeight: 'bold',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    fontSize: 14,
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
