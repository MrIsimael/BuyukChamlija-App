import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase authentication method
import { setDoc, doc } from 'firebase/firestore'; // Firestore methods for setting document data
import { auth, db } from '../firebase'; // Import Firebase configuration

// Component for creating a new admin user
const AdminCreation = () => {
  const [email, setEmail] = useState(''); // Input state for admin email
  const [password, setPassword] = useState(''); // Input state for admin password

  // Function to handle the creation of an admin user
  const createAdminUser = async () => {
    // Ensure that both fields are filled out
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields'); // Show an error if fields are empty
      return;
    }

    try {
      // Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Extract the created user's data
      const user = userCredential.user;

      // Add the user's admin details to the Firestore database
      await setDoc(doc(db, 'admins', user.uid), {
        email: user.email,
        role: 'admin', // Mark user as an admin
        createdAt: new Date(), // Store creation date
      });

      // Notify the user of successful creation and reset inputs
      Alert.alert('Success', 'Admin user created successfully');
      setEmail(''); // Clear the email field
      setPassword(''); // Clear the password field
    } catch (error) {
      // Handle any errors during the process
      console.error('Error creating admin user:', error);
      Alert.alert('Error', error.message); // Display the error to the user
    }
  };

  // Render the input form and submit button
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Admin User</Text> {/* Form title */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail} // Update email state on text change
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword} // Update password state on text change
        secureTextEntry // Hide password input
      />
      <Button title="Create Admin" onPress={createAdminUser} /> {/* Submit button */}
    </View>
  );
};

// Define styles for the form and its components
const styles = StyleSheet.create({
  container: {
    flex: 1, // Use the entire screen space
    justifyContent: 'center', // Center the content vertically
    padding: 20, // Add padding to the container
  },
  title: {
    fontSize: 24, // Large font size for the title
    marginBottom: 20, // Space below the title
    textAlign: 'center', // Center-align the title text
  },
  input: {
    borderWidth: 1, // Thin border for input fields
    borderColor: 'gray', // Gray border color
    padding: 10, // Inner padding for text inputs
    marginBottom: 10, // Space below each input field
    borderRadius: 5, // Rounded corners for input fields
  },
});

export default AdminCreation; // Export the component for use in the app
