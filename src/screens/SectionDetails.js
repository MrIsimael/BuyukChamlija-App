import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const SectionDetails = ({ route, navigation }) => {
  const { sectionId } = route.params;
  const [section, setSection] = useState(null);
  const [stalls, setStalls] = useState([]);
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        // Fetch section details
        const sectionDoc = await getDocs(collection(db, 'sections'));
        sectionDoc.forEach(doc => {
          if (doc.id === sectionId) {
            setSection({ id: doc.id, ...doc.data() });
          }
        });

        // Fetch stalls in this section
        const stallsQuery = query(
          collection(db, 'stalls'),
          where('sectionId', '==', sectionId),
        );
        const stallsSnapshot = await getDocs(stallsQuery);
        const stallsData = stallsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStalls(stallsData);

        // Fetch items for each stall
        const itemsData = {};
        for (const stall of stallsData) {
          const itemsQuery = query(
            collection(db, 'items'),
            where('stallId', '==', stall.id),
          );
          const itemsSnapshot = await getDocs(itemsQuery);
          itemsData[stall.id] = itemsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
        }
        setItems(itemsData);
      } catch (error) {
        console.error('Error fetching section data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSectionData();
  }, [sectionId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF724C" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{section?.name || 'Section'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {stalls.map(stall => (
          <TouchableOpacity
            key={stall.id}
            style={styles.stallCard}
            onPress={() => {
              const stallItems = items[stall.id] || [];
              if (stallItems.length > 0) {
                navigation.navigate('ItemDetails', {
                  itemId: stallItems[0].id,
                  stallId: stall.id,
                });
              }
            }}
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
            </View>

            <View style={styles.stallInfo}>
              <Text style={styles.stallName}>{stall.name}</Text>
              <Text style={styles.stallNumber}>Stall {stall.stallNumber}</Text>

              <View style={styles.stallStats}>
                <View style={styles.itemCount}>
                  <Feather name="box" size={14} color="#8F92A1" />
                  <Text style={styles.statsText}>
                    {(items[stall.id] || []).length} Items
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    stall.isOpen ? styles.statusOpen : styles.statusClosed,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: stall.isOpen ? '#4CAF50' : '#FF4C4C' },
                    ]}
                  >
                    {stall.isOpen ? 'Open' : 'Closed'}
                  </Text>
                </View>
              </View>
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  stallCard: {
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    borderRadius: 15,
    marginBottom: 16,
    overflow: 'hidden',
  },
  stallImageContainer: {
    height: 150,
    width: '100%',
    backgroundColor: '#3D3F54',
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
  stallInfo: {
    padding: 16,
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
  },
  itemCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    color: '#8F92A1',
    fontSize: 14,
    marginLeft: 8,
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
  },
});

export default SectionDetails;
