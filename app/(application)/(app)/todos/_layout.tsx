import { Stack } from 'expo-router';
import { useColorScheme } from '@/lib/useColorScheme';

export default function AppStackLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Stack
      screenOptions={{
       
        headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="todos"
        options={{
          title: 'Todos',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="details/[id]"
        options={{
          title: 'Todo Details',
          headerShown: true,
        }}
       />
    </Stack>
  );
}


