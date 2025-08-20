import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/badge';
import { useColorScheme } from '@/lib/useColorScheme';
import type { Goal } from '@/lib/types';

interface GoalAgendaItemProps {
  item: Goal;
  onPress?: (goal: Goal) => void;
}

const statusColors: Record<Goal['status'], string> = {
  completed: 'text-green-600',
  in_progress: 'text-blue-600',
  on_hold: 'text-yellow-600',
  cancelled: 'text-red-600',
  // @ts-ignore
  not_started: 'text-gray-600'
};

const GoalAgendaItem: React.FC<GoalAgendaItemProps> = ({ item, onPress }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      className={`mx-4 my-2 rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
      onPress={() => onPress?.(item)}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
            {item.title}
          </Text>
          <Badge>
            <Text className={`${statusColors[item.status]}`}>{item.status.replace('_', ' ')}</Text>
          </Badge>
        </View>

        {item.description && (
          <Text className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View className="flex-row items-center mt-2">
          <Ionicons name="calendar-outline" size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <Text className={`ml-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {new Date(item.targetEndDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(GoalAgendaItem);


