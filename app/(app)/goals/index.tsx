import React from 'react';
import { View, FlatList } from 'react-native';
import { Text } from '~/components/ui/text';
import GoalCard from '@/components/cards/GoalCard';
import { useHandlers } from '@/hooks/data-provider';
import { useColorScheme } from '@/lib/useColorScheme';
import { useRouter } from 'expo-router';

export default function GoalsListScreen() {
  const { state, updateGoal, deleteGoal } = useHandlers();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const goals = state.goals ?? [];

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <GoalCard
            goal={item as any}
            onPress={() => router.push({ pathname: '/goals/[id]', params: { id: (item as any).id } })}
            onEdit={() => {}}
            onComplete={async (g) => updateGoal({ id: (g as any).id, status: 'completed', updatedAt: new Date().toISOString() })}
            onDelete={async (g) => deleteGoal((g as any).id)}
          />
        )}
        ListEmptyComponent={<Text className={`text-center mt-10 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No goals yet</Text>}
      />
    </View>
  );
}
