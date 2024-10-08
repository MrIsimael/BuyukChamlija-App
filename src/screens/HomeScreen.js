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
const cardWidth = width * 0.4;

const images = {
  barn: require('../../assets/barn.jpg'),
  karinja: require('../../assets/karinja.jpg'),
  student: require('../../assets/student.jpg'),
  zakaat: require('../../assets/zakaat.jpg'),
};

const Home = ({ navigation }) => {
  const renderImage = (imageName, style) => (
    <Image source={images[imageName]} style={style} resizeMode="cover" />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.welcomeSection}>
          <View style={styles.header}>
            <TouchableOpacity>
              <Feather name="menu" size={22} color="white" />
            </TouchableOpacity>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerIcon}>
                <Feather name="search" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIcon}>
                <Feather name="shopping-cart" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIcon}>
                <Feather name="user" size={22} color="white" />
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
            <TouchableOpacity style={styles.viewAllContainer}>
              <Text style={styles.viewAllText}>View All</Text>
              <Feather name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.card}>
              {renderImage('barn', styles.cardImage)}
              <Text style={styles.cardName}>The Barn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}>
              {renderImage('karinja', styles.cardImage)}
              <Text style={styles.cardName}>The Karinja</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Feather name="heart" size={24} color="white" />
              <Text style={styles.sectionTitle}>Donation</Text>
            </View>
            <TouchableOpacity style={styles.viewAllContainer}>
              <Text style={styles.viewAllText}>View All</Text>
              <Feather name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.card}>
              {renderImage('student', styles.cardImage)}
              <Text style={styles.cardName}>Sponsor a Student</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}>
              {renderImage('zakaat', styles.cardImage)}
              <Text style={styles.cardName}>Zakaat Commitment</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Feather name="calendar" size={24} color="white" />
              <Text style={styles.sectionTitle}>Festival Dates</Text>
            </View>
            <TouchableOpacity style={styles.viewAllContainer}>
              <Text style={styles.viewAllText}>View All</Text>
              <Feather name="chevron-right" size={24} color="white" />
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
    marginTop: 28,
    marginRight: 13,
    marginLeft: 10,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 16,
  },
  welcomeSection: {
    padding: 16,
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
    marginTop: 55,
    marginLeft: 15,
  },
  brandText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 15,
  },
  section: {
    padding: 16,
    marginTop: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: 10,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: 'white',
    marginRight: 5,
  },
  card: {
    width: 145,
    height: 112,
    marginRight: 16,
    borderRadius: 21,
    overflow: 'hidden',
    marginLeft: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 21,
  },
  cardName: {
    marginTop: 8,
    color: 'white',
    fontSize: 16,
  },
  festivalCard: {
    width: 318,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#3D3F54',
    padding: 16,
    borderRadius: 21,
    marginLeft: 8,
  },
  festivalDate: {
    fontSize: 16,
    color: 'white',
  },
  festivalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
  },
});

export default Home;
