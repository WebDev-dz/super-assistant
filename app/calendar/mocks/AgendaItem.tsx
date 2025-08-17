import React, { useCallback } from 'react';
import { Alert, View, Text, TouchableOpacity, Button } from 'react-native';
import testIDs from '../testIDs';
// import { Todo } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { categories } from '@/components/ui/category-selector';


export interface Todo {
  id: string;
  milestoneId?: string | null; // null => standalone todo
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string; // ISO
  createdAt: string; // ISO
  updatedAt?: string; // ISO
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[]; // Array of strings
}

interface ItemProps {
  item: Todo;
}

const AgendaItem = (props: ItemProps) => {
  const { item } = props;

  const buttonPressed = useCallback(() => {
    Alert.alert('Task Info', `Details: ${item.description || 'No description available'}`);
  }, [item]);

  const itemPressed = useCallback(() => {
    Alert.alert('Task Selected', `Task: ${item.title}`);
  }, [item]);

  if (!item) {
    return (
      <View className="px-5 py-3 border-b border-gray-300">
        <Text className="text-gray-400 text-sm">No Tasks Planned Today</Text>
      </View>
    );
  }

  const categoryName = "health"
  const category = categories.filter(c => c.value === categoryName).at(0)!
  const isSelected = true

  return (
    <TouchableOpacity
      onPress={itemPressed}
      className="flex-row items-center justify-between px-5 py-3 border-b border-gray-300 bg-white"
      testID={testIDs.agenda.ITEM}
    >
      <View
        key={category.value}
        className={`flex-1 items-center justify-center py-4 px-3 rounded-xl border-2 bg-white m-1 shadow-sm ${isSelected
            ? `${category.borderColor} ${category.selectedBg} shadow-md`
            : "border-gray-200"
          }`}
      // activeOpacity={0.7}
      style = {{maxWidth: 50}}
      >
        <View
          className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${isSelected ? "" : category.bgColor
            }`}
          style={
            isSelected ? { backgroundColor: category.color } : undefined
          }
        >
          <Ionicons
            name={category.icon}
            size={24}
            color={isSelected ? "#ffffff" : category.color}
          />
        </View>
        

      </View>
      <View>
        <Text className="text-black font-bold text-lg">{item.title}</Text>
        <Text className="text-gray-500 text-sm mt-1">Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'No due date'}</Text>
      </View>
      {/* <View className="flex-row items-center space-x-2">
        <Button color={'#6b7280'} title={'Info'} onPress={buttonPressed} />
      </View> */}
    </TouchableOpacity>
  );
};

export default React.memo(AgendaItem);
