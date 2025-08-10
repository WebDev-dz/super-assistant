import React, { useMemo } from 'react';
import { View, FlatList } from 'react-native';
import { Text } from '~/components/ui/text';
import { useHandlers } from '@/hooks/data-provider';
import { useColorScheme } from '@/lib/useColorScheme';
import { MileStoneCard } from '@/components/MileStoneCard';

export default function MilestonesListScreen() {
  const { state, updateMilestone, deleteMilestone } = useHandlers();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const milestones = state.milestones ?? [];

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <FlatList
        data={milestones}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <MileStoneCard
            milestone={item as any}
            onPress={() => {}}
            onEdit={() => {}}
            onComplete={() => {}}
          />
        )}
        ListEmptyComponent={<Text className={`text-center mt-10 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No milestones yet</Text>}
      />
    </View>
  );
}


