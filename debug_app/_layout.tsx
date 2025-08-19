// app/_layout.tsx
import { InstantDataProvider } from "@/hooks/data-provider";
import { useColorScheme } from "@/lib/useColorScheme";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";


import Toaster from "react-native-toast-message";

import { PortalHost } from '@rn-primitives/portal';
import { NAV_THEME } from "@/lib/constants";

import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};


function AppLayout() {

  const { colorScheme, isDarkColorScheme } = useColorScheme();
  return (
    
    <SafeAreaView edges={['top', 'left', 'right']} className={`flex-1  ${isDarkColorScheme ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <Stack>
        <Stack.Screen name="(application)" options={{
          headerShown: false
        }} />
        <Stack.Screen name="(auth)" options={{
          headerShown: false
        }} />

      </Stack>
    // </SafeAreaView>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
              <AppLayout />
            </BottomSheetModalProvider>
          </InstantDataProvider>
          <Toaster />
          <PortalHost />
        </GestureHandlerRootView>
      </ThemeProvider>
    </ClerkProvider>
  );
}



const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;