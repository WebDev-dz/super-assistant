// app/_layout.tsx
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "@/lib/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useRef, useState, useEffect } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, router } from "expo-router";
import { NAV_THEME } from "@/lib/constants";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Toaster from "react-native-toast-message";
import { PortalHost } from "@rn-primitives/portal";
import { InstantDataProvider } from "@/hooks/data-provider";
import { useAuth } from "@clerk/clerk-expo";

const LIGHT_THEME = {
  ...DefaultTheme,
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME = {
  ...DarkTheme,
  dark: true,
  colors: NAV_THEME.dark,
};



const AppLayout = () => {
  const { isDarkColorScheme } = useColorScheme();

  const { userId } = useAuth();



  return (
    <InstantDataProvider ownerId={userId || ""}>
      <BottomSheetModalProvider>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
        <Toaster />
        <PortalHost />
      </BottomSheetModalProvider>
    </InstantDataProvider>
  )


}

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      if (Platform.OS === "web") {
        document.documentElement.classList.add("bg-background");
      }
      setIsColorSchemeLoaded(true);
      hasMounted.current = true;
    }
  }, []);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        //  await AsyncStorage.removeItem("hasLaunched")
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (hasLaunched === null) {
          await AsyncStorage.setItem("hasLaunched", "true");
          router.push("/onboarding");
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
        </GestureHandlerRootView>
      </ThemeProvider>
    </ClerkProvider>
  );
}
