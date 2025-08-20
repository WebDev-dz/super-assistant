import React, { useCallback } from 'react';
import { Alert, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { categories } from '@/components/ui/category-selector';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge, badgeTextVariants, getPriorityVariant } from '@/components/ui/badge';
import { useColorScheme } from '@/lib/useColorScheme';
import type { Todo } from '@/lib/types';
import testIDs from '@/app/(application)/calendar/testIDs';

interface ItemProps {
  item: Todo;
  onToggleComplete?: (id: string, completed: boolean) => void;
}

const TodoAgendaItem = (props: ItemProps) => {
  const { item, onToggleComplete } = props;
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const itemPressed = useCallback(() => {
    Alert.alert('Task Selected', `Task: ${item.title}`);
  }, [item]);

  const handleToggleComplete = useCallback((value: boolean) => {
    onToggleComplete?.(item.id, value);
  }, [item.id, item.completed, onToggleComplete]);

  if (!item) {
    return (
      <View className={`px-5 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
        <Text className={isDark ? 'text-gray-500' : 'text-gray-400'}>No Tasks Planned Today</Text>
      </View>
    );
  }

  const categoryName = 'health';
  const category = categories.filter(c => c.value === categoryName).at(0)!;
  const isSelected = true;

  return (
    <TouchableOpacity
      onPress={itemPressed}
      className={`mx-4 my-2 rounded-2xl overflow-hidden ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}
      testID={testIDs.agenda.ITEM}
      style={{
        shadowColor: category.color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 4
      }}
    >
      <View className="flex-row items-start p-3">
        <View className="mt-3">
          <Checkbox checked={item.completed} onCheckedChange={handleToggleComplete} />
        </View>
        <View className='flex-1 ml-3'>
          <View className='flex-row items-start gap-2'>
            <View
              className={`items-center justify-center rounded-xl ${
                isSelected
                  ? category.selectedBg
                  : isDark ? 'bg-gray-700' : 'bg-gray-50'
              } p-2.5`}
            >
              <View
                className={`w-9 h-9 rounded-lg items-center justify-center ${
                  isSelected ? '' : category.bgColor
                }`}
                style={
                  isSelected ? { backgroundColor: category.color } : undefined
                }
              >
                <Ionicons
                  name={category.icon}
                  size={18}
                  color={isSelected ? '#ffffff' : category.color}
                />
              </View>
            </View>

            <View className="flex-1 ml-2">
              <View className="flex-row items-center justify-between">
                <Text className={`font-bold text-base flex-1 mr-2 ${
                  isDark ? 'text-gray-100' : 'text-black'
                }`}>
                  {item.title}
                </Text>
                <Badge variant={getPriorityVariant(item.priority)}>
                  <Text className={badgeTextVariants({ variant: getPriorityVariant(item.priority) })}>
                    {item.priority}
                  </Text>
                </Badge>
              </View>

              <View className="flex-row items-center mt-1.5">
                <Ionicons 
                  name="calendar-outline" 
                  size={14} 
                  color={isDark ? '#9CA3AF' : '#6B7280'} 
                />
                <Text className={`text-xs ml-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'No due date'}
                </Text>
                {item.estimatedHours && (
                  <View className="flex-row items-center ml-3">
                    <Ionicons 
                      name="time-outline" 
                      size={14} 
                      color={isDark ? '#9CA3AF' : '#6B7280'} 
                    />
                    <Text className={`text-xs ml-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {item.estimatedHours}h
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          
          {item.description && (
            <View className="px-4 pb-3 mt-2">
              <Text className={`text-xs leading-4 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(TodoAgendaItem);


