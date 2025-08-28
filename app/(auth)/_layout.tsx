// app/(auth)/_layout.tsx
import { router, Stack } from 'expo-router';
import { useColorScheme } from '@/lib/useColorScheme';
import { useAuth } from '@clerk/clerk-expo';
import { useEffect } from 'react';

export default function AuthLayout() {
  const { colorScheme } = useColorScheme();

  const {isSignedIn } = useAuth()

  useEffect(() => {
    if (isSignedIn){
      router.push("/")
    }
  },[isSignedIn])

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
        },
        headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShown: false, // Hide headers for auth screens for cleaner look
      }}
    >
      <Stack.Screen
        name="sign-in"
        options={{
          title: 'Sign In',
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: 'Sign Up',
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}