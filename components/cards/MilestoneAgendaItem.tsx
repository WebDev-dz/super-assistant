import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Progress } from '@/components/ui/progress';
import { useColorScheme } from '@/lib/useColorScheme';
import type { Milestone } from '@/lib/types';

interface MilestoneAgendaItemProps {
  item: Milestone;
  onPress?: (milestone: Milestone) => void;
}

const MilestoneAgendaItem: React.FC<MilestoneAgendaItemProps> = ({ item, onPress }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      className={`mx-4 my-2 rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
      onPress={() => onPress?.(item)}
    >
      <View className="p-4">
        <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
          {item.title}
        </Text>
        {item.description && (
          <Text className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <View className="mt-3">
          <Progress value={item.percentage} />
          <Text className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.percentage}% Complete</Text>
        </View>
        <Text className={`mt-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Due: {new Date(item.deadline).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(MilestoneAgendaItem);


