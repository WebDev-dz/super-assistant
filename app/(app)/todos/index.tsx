import React, { useCallback, useMemo, useState } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Text } from '~/components/ui/text';
import { useHandlers } from '@/hooks/data-provider';
import { useColorScheme } from '@/lib/useColorScheme';
import TodoCard from '@/components/cards/TodoCard';

export default function TodosScreen() {
  const { state, isLoading, error, updateTask, deleteTask } = useHandlers();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [refreshing, setRefreshing] = useState(false);

  const tasks = state.tasks ?? [];
  const milestones = state.milestones ?? [];

  const milestoneMap = useMemo(() => {
    const map: Record<string, string> = {};
    milestones.forEach(m => { map[m.id] = m.title; });
    return map;
  }, [milestones]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 400);
  }, []);

  const handleToggleComplete = async (task: any) => {
    try {
      await updateTask({ id: task.id, completed: !task.completed, updatedAt: Date.now() });
    } catch {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleDelete = (task: any) => {
    Alert.alert('Delete Task', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { try { await deleteTask(task.id); } catch {} } }
    ]);
  };

  if (isLoading) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <ActivityIndicator />
        <Text className="mt-2 text-muted-foreground">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <Text className="text-red-500">Failed to load data</Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <TodoCard
            task={item}
            milestoneMap={milestoneMap}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
            isDark={isDark}
          />
        )}
      />
    </View>
  );
}

// end of file