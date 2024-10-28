import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const FestivalScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to format Firestore timestamp
  const formatTimestamp = timestamp => {
    if (!timestamp) return '';
    if (timestamp.seconds) {
      // Convert Firestore timestamp to Date object
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString();
    }
    return timestamp;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsQuery = query(
          collection(db, 'events'),
          orderBy('date', 'asc'),
        );
        const eventsSnapshot = await getDocs(eventsQuery);
        const eventsData = eventsSnapshot.docs.map(doc => {
          const data = doc.data();
          // Process the data to ensure all timestamp fields are converted to strings
          return {
            id: doc.id,
            name: data.name || '',
            description: data.description || '',
            location: data.location || '',
            status: data.status || '',
            date: formatTimestamp(data.date),
            endDate: formatTimestamp(data.endDate),
            createdAt: formatTimestamp(data.createdAt),
            schedule: {
              startTime: data.schedule?.startTime || '',
              endTime: data.schedule?.endTime || '',
            },
          };
        });
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const renderEventCard = event => {
    const isActive = event.status === 'active';

    return (
      <View key={event.id} style={styles.eventCard}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{event.date}</Text>
          <View
            style={[
              styles.statusBadge,
              isActive ? styles.activeBadge : styles.inactiveBadge,
            ]}
          >
            <Text
              style={[styles.statusText, isActive && styles.activeStatusText]}
            >
              {isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        <Text style={styles.eventName}>{event.name || 'Unnamed Event'}</Text>
        <Text style={styles.description}>
          {event.description || 'No description available'}
        </Text>

        <View style={styles.eventDetails}>
          {event.location ? (
            <View style={styles.detailItem}>
              <Feather name="map-pin" size={16} color="#FF724C" />
              <Text style={styles.detailText}>{event.location}</Text>
            </View>
          ) : null}

          {event.schedule?.startTime ? (
            <View style={styles.detailItem}>
              <Feather name="clock" size={16} color="#FF724C" />
              <Text style={styles.detailText}>
                {event.schedule.startTime}
                {event.schedule.endTime ? ` - ${event.schedule.endTime}` : ''}
              </Text>
            </View>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() =>
            navigation.navigate('EventDetails', { eventId: event.id })
          }
        >
          <Text style={styles.detailsButtonText}>View Details</Text>
          <Feather name="arrow-right" size={18} color="#FF724C" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Feather name="menu" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Festival Dates</Text>
        <TouchableOpacity>
          <Feather name="calendar" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <Text style={styles.subTitle}>
          Mark your calendar for these special dates
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF724C" />
          </View>
        ) : events.length > 0 ? (
          events.map(renderEventCard)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No events scheduled</Text>
          </View>
        )}

        <View style={styles.notificationSection}>
          <View style={styles.notificationCard}>
            <Feather
              name="bell"
              size={24}
              color="#FF724C"
              style={styles.notificationIcon}
            />
            <Text style={styles.notificationText}>
              Turn on notifications to stay updated about upcoming festivals and
              events
            </Text>
            <TouchableOpacity style={styles.notificationButton}>
              <Text style={styles.notificationButtonText}>
                Enable Notifications
              </Text>
            </TouchableOpacity>
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
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#8F92A1',
    fontSize: 16,
  },
  eventCard: {
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#FF724C',
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  inactiveBadge: {
    backgroundColor: 'rgba(255, 114, 76, 0.1)',
  },
  statusText: {
    fontSize: 12,
    color: '#FF724C',
  },
  activeStatusText: {
    color: '#4CAF50',
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#8F92A1',
    marginBottom: 16,
    lineHeight: 20,
  },
  eventDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    color: '#8F92A1',
    marginLeft: 8,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 114, 76, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  detailsButtonText: {
    color: '#FF724C',
    marginRight: 8,
  },
  notificationSection: {
    marginVertical: 20,
  },
  notificationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
  },
  notificationIcon: {
    marginBottom: 12,
  },
  notificationText: {
    color: '#8F92A1',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  notificationButton: {
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  notificationButtonText: {
    color: '#FF724C',
    fontWeight: 'bold',
  },
});

export default FestivalScreen;
