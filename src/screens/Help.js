import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Linking,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const Help = ({ navigation }) => {
  const helpItems = [
    {
      icon: 'book-open',
      title: 'FAQ',
      description: 'Frequently asked questions',
      onPress: () =>
        Alert.alert('Coming Soon', 'FAQ section will be available soon.'),
    },
    {
      icon: 'mail',
      title: 'Contact Support',
      description: 'Get help from our team',
      onPress: () => Linking.openURL('mailto:info@buyukchamlija.co.za'),
    },
    {
      icon: 'phone',
      title: 'Call Us',
      description: 'Speak with customer service',
      onPress: () => Linking.openURL('tel:+27 65 585 9178'),
    },
    {
      icon: 'file-text',
      title: 'Terms & Conditions',
      description: 'Read our terms of service',
      onPress: () =>
        Alert.alert('Coming Soon', 'Terms will be available soon.'),
    },
    {
      icon: 'shield',
      title: 'Privacy Policy',
      description: 'Read our privacy policy',
      onPress: () =>
        Alert.alert('Coming Soon', 'Privacy policy will be available soon.'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {helpItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.helpCard}
            onPress={item.onPress}
          >
            <View style={styles.helpLeft}>
              <View style={styles.iconContainer}>
                <Feather name={item.icon} size={24} color="#FF724C" />
              </View>
              <View style={styles.helpDetails}>
                <Text style={styles.helpTitle}>{item.title}</Text>
                <Text style={styles.helpDescription}>{item.description}</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={24} color="#8F92A1" />
          </TouchableOpacity>
        ))}
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
  helpCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    padding: 16,
    borderRadius: 15,
    marginBottom: 16,
  },
  helpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 114, 76, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpDetails: {
    marginLeft: 16,
    flex: 1,
  },
  helpTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpDescription: {
    color: '#8F92A1',
    fontSize: 14,
    marginTop: 4,
  },
});

export default Help;
