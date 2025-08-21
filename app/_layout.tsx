// app/_layout.tsx
import { InstantDataProvider } from "@/hooks/data-provider";
import { useColorScheme } from "@/lib/useColorScheme";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

import Toaster from "react-native-toast-message";

import { PortalHost } from "@rn-primitives/portal";
import { NAV_THEME } from "@/lib/constants";

import { router, Stack } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

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
  const { height } = useWindowDimensions();

  const { userId } = useAuth()
  return (
    <InstantDataProvider ownerId={userId || ""}>
      <BottomSheetModalProvider>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <SafeAreaView
          edges={["top", "bottom", "right"]}
          className={`flex-1`}
          style={{
            height: height ,
          }}
        >
          <Stack.Screen
              name="(auth)"
              options={{
                headerShown: false,
              }}
            />
          <Stack>
            <Stack.Screen
              name="(application)"
              options={{
                headerShown: false,
              }}
            />
            
          </Stack>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </InstantDataProvider>

  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasMounted = useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

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

  React.useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (hasLaunched === null) {
          // First time launch
          await AsyncStorage.setItem("hasLaunched", "true");
          router.push("/onboarding");
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (e) {
        console.error("Error checking first launch", e);
      }
    };

    checkFirstLaunch();
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppLayout />

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
