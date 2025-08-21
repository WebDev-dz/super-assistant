// app/(auth)/_layout.tsx
import { router, Stack } from "expo-router";
import { useColorScheme } from "@/lib/useColorScheme";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";

export default function AuthLayout() {
  const { colorScheme } = useColorScheme();

  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn]);

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide headers for auth screens for cleaner look
      }}
    >
      <Stack.Screen
        name="sign-in"
        options={{
          title: "Sign In",
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: "Sign Up",
        }}
      />
      <Stack.Screen
        name="get-started"
        options={{
          title: "Get Started",
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: "Forgot Password",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="enter-otp"
        options={{
          title: "Enter OTP",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="new-password"
        options={{
          title: "New Password",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
