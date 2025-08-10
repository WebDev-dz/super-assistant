import React from 'react';
import { View, Pressable } from 'react-native';
import { Checkbox } from '~/components/ui/checkbox';
import { Button, buttonTextVariants } from '~/components/ui/button';
import { Card, CardHeader, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Calendar, Trash2 } from 'lucide-react-native';
import type { Task, Priority } from '@/lib/types';

interface TodoCardProps {
  task: Task;
  milestoneMap: Record<string, string>;
  onToggleComplete: (task: Task) => void;
  onDelete: (task: Task) => void;
  onPress?: (task: Task) => void;
  onLongPress?: (task: Task) => void;
  isDark: boolean;
}

const TodoCard: React.FC<TodoCardProps> = ({ task, milestoneMap, onToggleComplete, onDelete, onPress, onLongPress, isDark }) => {
  const priorityColors: Record<Priority, string> = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  return (
    <Card className={`mb-3 mx-3 rounded-lg shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <Pressable onPress={() => onPress?.(task)} onLongPress={() => onLongPress?.(task)}>
        <CardHeader className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggleComplete(task)}
              className={`${isDark ? 'border-gray-600' : 'border-gray-300'}`}
            />
            <View>
              <Text
                className={`text-base font-medium ${
                  task.completed ? 'line-through text-muted-foreground' : isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {task.title}
              </Text>
              <View className="flex-row items-center gap-2 mt-1">
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  {task.milestoneId ? milestoneMap[task.milestoneId] : 'Unassigned'}
                </Text>
                <Text
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    isDark ? priorityColors[task.priority].replace('100', '700') : priorityColors[task.priority]
                  }`}
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Text>
              </View>
              <View className="flex-row items-center gap-2 mt-1">
                 <Calendar size={18} color={isDark ? '#ef4444' : '#dc2626'} />
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  {task.dueDate ? (new Date(task.dueDate).toDateString()) : 'Unassigned'}
                </Text>
                </View>
            </View>
          </View>
          <Pressable onPress={() => onDelete(task)}>
            <Trash2 size={20} color={isDark ? '#ef4444' : '#dc2626'} />
          </Pressable>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {task.description && (
            <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {task.description}
            </Text>
          )}
          {task.dueDate && (
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </Text>
          )}
        </CardContent>
      </Pressable>
    </Card>
  );
};

export default TodoCard;