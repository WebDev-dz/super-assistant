import "react-native-get-random-values";
import "react-native-reanimated";
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import '@/polyfills';
import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";

import "../../global.css";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Tabs } from "expo-router";
import Toaster from "react-native-toast-message";
import { useColorScheme } from "@/lib/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text, View, StyleSheet, Platform, TouchableOpacity, Pressable } from "react-native";
import { NAV_THEME } from "@/lib/constants";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState, useCallback } from "react";
import { InstantDataProvider } from "@/hooks/data-provider";
import { Calendar1Icon, MessageCircle } from "lucide-react-native";
// Removed Animated imports since we're not using animations

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  ErrorBoundary,
} from "expo-router";



// Option Button Component


export default function TabsLayout() {
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const { isSignedIn } = useAuth();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "#8E8E93",
          tabBarStyle: {
            backgroundColor: colorScheme === "dark" ? "#1C1C1E" : "#FFFFFF",
            borderTopColor: colorScheme === "dark" ? "#38383A" : "#C6C6C8",
            height: 110,
            padding: 10,
          },
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#1C1C1E" : "#FFFFFF",
          },
          headerTintColor: colorScheme === "dark" ? "#FFFFFF" : "#000000",
        }}
      >
        {/* Home Tab */}
        <Tabs.Screen
          name="(app)"
          options={{
            headerStyle: { display: "none" },
            headerShown: false,
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color, fontSize: size }}>🎯</Text>
            ),
          }}
        />

        {/* On Boarding */}

        <Tabs.Screen
          name="onboarding"
          options={{
            headerStyle: { display: "none" },
            headerShown: false,
            tabBarStyle:{
              display: "none"
            }
          }}
        />

        {/* Todos Tab */}
        <Tabs.Screen
          name="(app)/todos/index"
          options={{
            title: "Todos",
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color, fontSize: size }}>✓</Text>
            ),
          }}
        />

        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MessageCircle size={size} color={color} />
            ),
          }}
        />

        {/* Calendar Tab */}
        <Tabs.Screen
          name="calendar"
          options={{
            title: "Calendar",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Calendar1Icon size={size} color={color} />
            ),
          }}
        />


        {/* Menu Stack Tab */}
        <Tabs.Screen
          name="menu"
          options={{
            title: "Menu",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="menu-outline" size={size} color={color} />
            ),
          }}
        />

        {/* Hide auth screens from tabs when signed in */}
        <Tabs.Screen
          name="(auth)"
          options={{
            headerShown: false,
            // href: null,
            tabBarButton: () => null
          }}
        />
      </Tabs>

      {/* FAB - only show when signed in */}
      {/* {isSignedIn && <FloatingActionButton />} */}
    </>
  );
}

