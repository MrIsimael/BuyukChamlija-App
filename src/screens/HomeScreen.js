import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';

const { width } = Dimensions.get('window');

const images = {
  barn: require('../../assets/barn.jpg'),
  karinja: require('../../assets/karinja.jpg'),
  student: require('../../assets/student.jpg'),
  zakaat: require('../../assets/zakaat.jpg'),
};

const Home = ({ navigation }) => {
  const [sections, setSections] = useState([]);
  const [sectionStalls, setSectionStalls] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSectionsAndStalls = async () => {
      try {
        // Fetch sections
        const sectionsQuery = query(
          collection(db, 'sections'),
          orderBy('createdAt', 'desc'),
        );
        const sectionsSnapshot = await getDocs(sectionsQuery);
        const sectionsData = sectionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSections(sectionsData);

        // Fetch stalls for each section
        const stallsData = {};
        for (const section of sectionsData) {
          const stallsQuery = query(
            collection(db, 'stalls'),
            where('sectionId', '==', section.id),
            orderBy('stallNumber', 'asc'),
          );
          const stallsSnapshot = await getDocs(stallsQuery);
          stallsData[section.id] = stallsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
        }
        setSectionStalls(stallsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSectionsAndStalls();
  }, []);

  const renderImage = (imageName, style) => (
    <Image source={images[imageName]} style={style} resizeMode="cover" />
  );

  const renderSectionWithStalls = section => {
    const stalls = sectionStalls[section.id] || [];

    return (
      <View key={section.id} style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Feather name="grid" size={24} color="white" />
            <Text style={styles.sectionTitle}>{section.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.viewAllContainer}
            onPress={() =>
              navigation.navigate('SectionDetails', { sectionId: section.id })
            }
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Feather name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {stalls.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {stalls.map(stall => (
              <TouchableOpacity
                key={stall.id}
                style={styles.stallCard}
                onPress={() =>
                  navigation.navigate('StallDetails', {
                    stallId: stall.id,
                    sectionId: section.id,
                  })
                }
              >
                <View style={styles.stallImageContainer}>
                  {stall.imageUrl ? (
                    <Image
                      source={{ uri: stall.imageUrl }}
                      style={styles.stallImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.stallPlaceholder}>
                      <Feather name="package" size={30} color="#8F92A1" />
                    </View>
                  )}
                  <View style={styles.editButton}>
                    <Feather name="chevron-right" size={18} color="#FF724C" />
                  </View>
                </View>

                <View style={styles.stallInfo}>
                  <Text style={styles.stallName}>{stall.name}</Text>
                  <Text style={styles.stallNumber}>
                    Stall {stall.stallNumber}
                  </Text>

                  <View style={styles.stallStats}>
                    <View style={styles.itemCount}>
                      <Feather name="box" size={14} color="#8F92A1" />
                      <Text style={styles.statsText}>
                        {stall.itemCount || 0} Items
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        stall.isOpen ? styles.statusOpen : styles.statusClosed,
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {stall.isOpen ? 'Open' : 'Closed'}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No stalls available</Text>
          </View>
        )}
      </View>
    );
  };

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

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF724C" />
          </View>
        ) : (
          sections.map(renderSectionWithStalls)
        )}

        {/* Donation Section */}
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

        {/* Festival Section */}
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
  sectionCard: {
    width: width * 0.7,
    backgroundColor: '#3D3F54',
    borderRadius: 21,
    padding: 16,
    marginRight: 16,
    marginLeft: 10,
  },
  sectionContent: {
    flex: 1,
  },
  sectionName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  stallCount: {
    fontSize: 14,
    color: '#FF724C',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  loadingContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  },
  stallCardBackground: {
    backgroundColor: '#3D3F54',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stallNumber: {
    color: '#FF724C',
    fontSize: 12,
    marginTop: 4,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stallCard: {
    width: 200,
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    borderRadius: 15,
    marginRight: 16,
    marginLeft: 10,
    overflow: 'hidden',
  },
  stallImageContainer: {
    height: 120,
    width: '100%',
    backgroundColor: '#2A2C41',
    position: 'relative',
  },
  stallImage: {
    width: '100%',
    height: '100%',
  },
  stallPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3D3F54',
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stallInfo: {
    padding: 12,
  },
  stallName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  stallNumber: {
    fontSize: 14,
    color: '#FF724C',
    marginBottom: 8,
  },
  stallStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    color: '#8F92A1',
    fontSize: 12,
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusOpen: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  statusClosed: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4CAF50',
  },
});

export default Home;
