import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.4; // 40% of screen width

// Import images statically
const images = {
  barn: require('../../assets/barn.jpg'),
  karinja: require('../../assets/karinja.jpg'),
  student: require('../../assets/student.jpg'),
  zakaat: require('../../assets/zakaat.jpg'),
};

const Home = ({ navigation }) => {
  const renderImage = (imageName, style) => {
    return (
      <Image source={images[imageName]} style={style} resizeMode="cover" />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.welcomeSection}>
          <View style={styles.header}>
            <TouchableOpacity>
              <Feather name="menu" size={20} color="white" />
            </TouchableOpacity>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerIcon}>
                <Feather name="search" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIcon}>
                <Feather name="shopping-cart" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIcon}>
                <Feather name="user" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.brandText}>Buyuk Chamlija</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Feather name="package" size={24} color="white" />
              <Text style={styles.sectionTitle}>Products</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.productCard}>
              {renderImage('barn', styles.productImage)}
              <Text style={styles.productName}>The Barn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.productCard}>
              {renderImage('karinja', styles.productImage)}
              <Text style={styles.productName}>The Karinja</Text>
            </TouchableOpacity>
            {/* Add more product cards as needed */}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Feather name="heart" size={24} color="white" />
              <Text style={styles.sectionTitle}>Donation</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.donationCard}>
              {renderImage('student', styles.donationImage)}
              <Text style={styles.donationName}>Sponsor a Student</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.donationCard}>
              {renderImage('zakaat', styles.donationImage)}
              <Text style={styles.donationName}>Zakaat Commitment</Text>
            </TouchableOpacity>
            {/* Add more donation cards as needed */}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Feather name="calendar" size={24} color="white" />
              <Text style={styles.sectionTitle}>Festival Dates</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.festivalCard}>
            <Text style={styles.festivalDate}>12 May 2024</Text>
            <Text style={styles.festivalName}>Kermus</Text>
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
    marginTop: 20,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 16,
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 60,
    marginLeft: 20,
  },
  brandText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
  section: {
    padding: 16,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  viewAllText: {
    color: '#FF724C',
  },
  productCard: {
    width: cardWidth,
    marginRight: 16,
  },
  productImage: {
    width: cardWidth,
    height: cardWidth * 0.67, // Maintain aspect ratio
    borderRadius: 8,
  },
  productName: {
    marginTop: 8,
    color: 'white',
  },
  donationCard: {
    width: cardWidth,
    marginRight: 16,
  },
  donationImage: {
    width: cardWidth,
    height: cardWidth * 0.67, // Maintain aspect ratio
    borderRadius: 8,
  },
  donationName: {
    marginTop: 8,
    color: 'white',
  },
  festivalCard: {
    backgroundColor: '#2A2C41',
    padding: 16,
    borderRadius: 8,
  },
  festivalDate: {
    fontSize: 16,
    color: 'white',
  },
  festivalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
  },
});

export default Home;
