
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, Platform, Alert, TouchableOpacity } from 'react-native';
import * as Calendar from 'expo-calendar';
import { Ionicons } from '@expo/vector-icons';

function CalendarItem({ 
  calendar, 
  eventCount,
  onDelete 
}: { 
  calendar: Calendar.Calendar; 
  eventCount: number;
  onDelete: (calendarId: string) => void;
}) {
  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Calendar',
      `Are you sure you want to delete "${calendar.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete(calendar.id)
        }
      ]
    );
  }, [calendar, onDelete]);

  return (
    <View
      className="flex-row items-center p-4 mb-3 rounded-xl shadow-sm"
      style={{ backgroundColor: calendar.color || '#f3f4f6' }}
    >
      <View className="w-8 h-8 rounded-full mr-4" style={{ backgroundColor: calendar.color || '#6b7280' }} />
      <View className="flex-1">
        <Text className="text-base font-bold text-white" numberOfLines={1}>{calendar.title}</Text>
        <Text className="text-xs text-white/80 mt-1">{eventCount} events</Text>
      </View>
      <TouchableOpacity 
        onPress={handleDelete}
        className="w-8 h-8 rounded-full bg-white/10 items-center justify-center"
      >
        <Ionicons name="trash-outline" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );
}

export default function DeviceCalendars() {
  const [calendars, setCalendars] = useState<Calendar.Calendar[]>([]);
  const [eventsCount, setEventsCount] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchCalendars = useCallback(async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      const cals = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      setCalendars(cals);
      // Fetch event counts for each calendar
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const counts: Record<string, number> = {};
      for (const cal of cals) {
        try {
          const events = await Calendar.getEventsAsync([cal.id], now, nextWeek);
          counts[cal.id] = events.length;
        } catch {
          counts[cal.id] = 0;
        }
      }
      setEventsCount(counts);
    }
    setLoading(false);
  }, []);

  const handleDeleteCalendar = useCallback(async (calendarId: string) => {
    try {
      await Calendar.deleteCalendarAsync(calendarId);
      setCalendars(prev => prev.filter(cal => cal.id !== calendarId));
      setEventsCount(prev => {
        const updated = { ...prev };
        delete updated[calendarId];
        return updated;
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to delete calendar. Please try again.');
      console.error('Error deleting calendar:', error);
    }
  }, []);

  useEffect(() => {
    fetchCalendars();
  }, [fetchCalendars]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-lg text-gray-500">Loading calendars...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background px-4 py-6">
      <Text className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Your Device Calendars</Text>
      {calendars.length === 0 ? (
        <Text className="text-gray-500">No calendars found.</Text>
      ) : (
        calendars.map((cal) => (
          <CalendarItem 
            key={cal.id} 
            calendar={cal} 
            eventCount={eventsCount[cal.id] || 0}
            onDelete={handleDeleteCalendar}
          />
        ))
      )}
    </ScrollView>
  );
}

// ...existing code...