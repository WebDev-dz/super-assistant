import { Stack } from 'expo-router';
import { useColorScheme } from '@/lib/useColorScheme';

export default function AppStackLayout() {
  const { colorScheme } = useColorScheme();

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
        name="todos/index"
        options={{
          title: 'Todos',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="todos/[id]"
        options={{
          title: 'Todo Details',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="goals/index"
        options={{
          title: 'Goals',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="goals/[id]"
        options={{
          title: 'Goal Details',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="milestones/index"
        options={{
          title: 'Milestones',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="milestones/[id]"
        options={{
          title: 'Milestone Details',
          headerShown: true,
        }}
      />
    </Stack>
  );
}


