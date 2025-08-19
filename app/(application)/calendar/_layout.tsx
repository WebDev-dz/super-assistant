// chat/_layout.tsx
import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from '@/lib/useColorScheme';
import { View, Text } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { Calendar } from '~/components/deprecated-ui/calendar'; // Assuming a Calendar component exists
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

function CustomDrawerContent(props: any) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className={`flex-1 ${isDark ? 'bg-background' : 'bg-white'}`}>
      {/* Header */}
      <View className="pt-12 pb-4 px-4 bg-card border-b border-border">
        <Text className="text-2xl font-bold text-foreground mb-2">
          Calendar
        </Text>
        <Text className="text-sm text-muted-foreground">
          Manage your events and schedules
        </Text>
      </View>

      {/* Calendar Component */}
      <DrawerContentScrollView 
        {...props} 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="py-4">
          {/* <Calendar /> */}

          <Link href={"/calendar/events"} >
            <Text> Events </Text>
          </Link>
        </View>

        <Separator className="mx-3 my-4" />

        {/* Actions */}
        <View className="px-3 pb-4">
          <Button
            variant="outline"
            onPress={() => {
              // Add event creation logic here
            }}
            className="flex-row items-center justify-center mb-3"
          >
            <Text className="font-medium">Add Event</Text>
          </Button>
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

export default function CalendarLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: {
            backgroundColor: isDark ? '#09090b' : '#ffffff',
            width: 320,
            borderRightWidth: 1,
            borderRightColor: isDark ? '#27272a' : '#e4e4e7',
          },
          headerStyle: {
            backgroundColor: isDark ? '#09090b' : '#ffffff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#27272a' : '#e4e4e7',
          },
          headerTintColor: isDark ? '#ffffff' : '#000000',
          headerTitle: 'Calendar',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
          drawerActiveTintColor: '#3b82f6',
          drawerInactiveTintColor: isDark ? '#71717a' : '#52525b',
          headerLeft: () => null, // Remove default back button since drawer handles it
        }}
      >
        {/* Default calendar screen */}
        <Drawer.Screen 
          name="index" 
          options={{ 
            drawerLabel: 'Calendar Home',
           headerShown: false,
          }} 
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}