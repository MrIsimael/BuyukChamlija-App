import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const FestivalScreen = ({ navigation }) => {
  const festivals = [
    {
      id: '1',
      name: 'Kermus',
      date: '12 May 2024',
      description:
        'Annual community celebration with food, activities, and cultural events',
      activities: [
        'Food Stalls',
        'Cultural Performances',
        "Children's Activities",
      ],
      status: 'upcoming',
    },
    {
      id: '2',
      name: 'Summer Festival',
      date: '15 July 2024',
      description:
        'Summer celebration featuring outdoor activities and special events',
      activities: ['Outdoor Games', 'Live Music', 'Special Sales'],
      status: 'upcoming',
    },
    {
      id: '3',
      name: 'Winter Fair',
      date: '10 December 2024',
      description:
        'Winter celebration with seasonal activities and festivities',
      activities: [
        'Winter Market',
        'Holiday Activities',
        'Community Gathering',
      ],
      status: 'planned',
    },
  ];

  const renderEventCard = event => {
    const isUpcoming = event.status === 'upcoming';

    return (
      <View key={event.id} style={styles.eventCard}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{event.date}</Text>
          <View
            style={[
              styles.statusBadge,
              isUpcoming ? styles.upcomingBadge : styles.plannedBadge,
            ]}
          >
            <Text style={styles.statusText}>
              {isUpcoming ? 'Upcoming' : 'Planned'}
            </Text>
          </View>
        </View>

        <Text style={styles.eventName}>{event.name}</Text>
        <Text style={styles.description}>{event.description}</Text>

        <View style={styles.activitiesContainer}>
          <Text style={styles.activitiesTitle}>Activities:</Text>
          {event.activities.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <Feather name="check-circle" size={16} color="#FF724C" />
              <Text style={styles.activityText}>{activity}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.detailsButton}>
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

        {festivals.map(renderEventCard)}

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
  upcomingBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  plannedBadge: {
    backgroundColor: 'rgba(255, 114, 76, 0.1)',
  },
  statusText: {
    fontSize: 12,
    color: '#FF724C',
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
  activitiesContainer: {
    marginBottom: 16,
  },
  activitiesTitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityText: {
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
