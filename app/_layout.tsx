import "react-native-get-random-values";
import "react-native-reanimated";
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

import "../global.css";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Tabs } from "expo-router";
import  Toaster  from "react-native-toast-message";
import { useColorScheme } from "@/lib/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text, View, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { NAV_THEME } from "@/lib/constants";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { InstantDataProvider } from "@/hooks/data-provider";
import { PortalHost } from '@rn-primitives/portal';

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

function RootLayoutNav() {
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const { isSignedIn } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#1C1C1E" : "#FFFFFF",
          borderTopColor: colorScheme === "dark" ? "#38383A" : "#C6C6C8",
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
          headerStyle: {display: "none"},
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🎯</Text>
          ),
          // header: () => (
          //   <View style={styles.header}>
          //     <Text style={styles.headerTitle}>Goals & Milestones</Text>
          //   </View>
          // ),
        }}
      />
      
      {/* Todos Tab */}
      <Tabs.Screen
        name="(app)/todos"
        options={{
          title: "Todos",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>✓</Text>
          ),
        }}
      />
      
      {/* Weather Tab */}
      <Tabs.Screen
        name="weather"
        options={{
          title: "Weather",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🌦️</Text>
          ),
        }}
      />
      
      {/* AI Chat Tab */}
      <Tabs.Screen
        name="chat/[id]"
        options={{
          title: "AI Chat",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>💬</Text>
          ),
          header: ({ route }: any) => (
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                AI Chat {route?.params?.id}
              </Text>
              <Text style={styles.headerSubtitle}>
                Create todos with AI assistance
              </Text>
            </View>
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
          // href: isSignedIn ? null : undefined,
          headerShown: false,
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}

export default function RootLayout() {
  const hasMounted = useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === "web") {
      document.documentElement.classList.add("bg-background");
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <InstantDataProvider ownerId="">
          <BottomSheetModalProvider>
            <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
            <RootLayoutNav />
          </BottomSheetModalProvider>

          </InstantDataProvider>
          <Toaster />
          <PortalHost />
        </GestureHandlerRootView>
      </ThemeProvider>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
});

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;