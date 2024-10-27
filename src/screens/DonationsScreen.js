import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const DonationsScreen = ({ navigation }) => {
  const donationOptions = [
    {
      id: '1',
      title: 'Sponsor a Student',
      image: require('../../assets/student.jpg'),
      description: 'Help support education for students in need',
      amount: '£50/month',
    },
    {
      id: '2',
      title: 'Zakaat Commitment',
      image: require('../../assets/zakaat.jpg'),
      description: 'Fulfill your Zakaat obligations',
      amount: 'Calculate based on wealth',
    },
    {
      id: '3',
      title: 'General Donation',
      image: require('../../assets/barn.jpg'),
      description: 'Support our community projects',
      amount: 'Any amount',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Feather name="menu" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Donations</Text>
        <TouchableOpacity>
          <Feather name="help-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Make a Difference</Text>
        <Text style={styles.subTitle}>Choose a cause to support</Text>

        {donationOptions.map(option => (
          <TouchableOpacity
            key={option.id}
            style={styles.donationCard}
            onPress={() => navigation.navigate('DonationDetails', { option })}
          >
            <Image source={option.image} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardDescription}>{option.description}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.amount}>{option.amount}</Text>
                <TouchableOpacity style={styles.donateButton}>
                  <Text style={styles.donateButtonText}>Donate Now</Text>
                  <Feather name="arrow-right" size={18} color="#FF724C" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Why Donate?</Text>
          <View style={styles.infoCard}>
            <Feather
              name="heart"
              size={24}
              color="#FF724C"
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              Your donations help support our community projects and make a real
              difference in people's lives. All donations are securely processed
              and tax-deductible.
            </Text>
          </View>
        </View>
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
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
  subTitle: {
    fontSize: 16,
    color: '#8F92A1',
    marginBottom: 20,
  },
  donationCard: {
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#8F92A1',
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 16,
    color: '#FF724C',
    fontWeight: 'bold',
  },
  donateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 114, 76, 0.1)',
    padding: 8,
    borderRadius: 8,
  },
  donateButtonText: {
    color: '#FF724C',
    marginRight: 8,
  },
  infoSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 16,
  },
  infoText: {
    flex: 1,
    color: '#8F92A1',
    lineHeight: 20,
  },
});

export default DonationsScreen;
