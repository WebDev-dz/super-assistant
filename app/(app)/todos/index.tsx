import React, { useCallback, useMemo, useState } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Text } from '~/components/ui/text';
import { useHandlers } from '@/hooks/data-provider';
import { useColorScheme } from '@/lib/useColorScheme';
import { useModalManager } from '@/hooks/useModalManager';
import TodoCard from '@/components/cards/TodoCard';
import TodoDetailsModal from '@/components/modals/TodoDetailsModal';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
// import { LinearGradient } from 'expo-linear-gradient';


export default function TodosScreen({ route, navigation }: any) {
  const { state, isLoading, error, updateTask, deleteTask } = useHandlers();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [refreshing, setRefreshing] = useState(false);
  const { modalState, openTodoDetails, closeTodoDetails } = useModalManager();

  console.log({ route, navigation });
  console.log("TodosScreen state:", state);

  const tasks = React.useMemo(() => state.tasks ?? [], [state]);
  const milestones = React.useMemo(() => state.milestones ?? [], [state]);
  console.warn("Tasks:", tasks);

  const milestoneMap = useMemo(() => {
    const map: Record<string, string> = {};
    milestones.forEach(m => { map[m.id] = m.title; });
    return map;
  }, [milestones]);

  const completedTasks = useMemo(() => tasks.filter(t => t.completed).length, [tasks]);
  const completionRate = useMemo(() =>
    tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0,
    [tasks.length, completedTasks]
  );

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
      { text: 'Delete', style: 'destructive', onPress: async () => { try { await deleteTask(task.id); } catch { } } }
    ]);
  };

  if (isLoading) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <View className="items-center">
          <ActivityIndicator size="large" color={isDark ? '#3B82F6' : '#1D4ED8'} />
          <Text className={`mt-4 text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading your tasks...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className={`flex-1 items-center justify-center p-6 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <View className={`p-6 rounded-2xl ${isDark ? 'bg-red-950/20 border border-red-900/30' : 'bg-red-50 border border-red-200'}`}>
          <Text className={`text-lg font-semibold text-center mb-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            Oops! Something went wrong
          </Text>
          <Text className={`text-center ${isDark ? 'text-red-300' : 'text-red-500'}`}>
            Failed to load your tasks. Please try again.
          </Text>
        </View>
      </View>
    );
  }

  const StatCard = ({ title, value, subtitle, color }: any) => (
    <View className={`flex-1 mx-1 p-4 rounded-2xl ${isDark ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'} backdrop-blur-md`}>
      <Text className={`text-2xl font-bold ${color}`}>{value}</Text>
      <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{title}</Text>
      {subtitle && (
        <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</Text>
      )}
    </View>
  );


  return (
    <SafeAreaView edges={['top', 'left', 'right']} className={`flex-1  ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Gradient Background */}
      {/* <LinearGradient
        colors={isDark ? ['rgba(59, 130, 246, 0.05)', 'transparent'] : ['rgba(59, 130, 246, 0.03)', 'transparent']}
        className="absolute top-0 left-0 right-0 h-80"
      /> */}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? '#3B82F6' : '#1D4ED8'}
          />
        }
        ListHeaderComponent={() => (
          <View className='gap-3'>
            {/* Header Section */}

            <View className={cn("px-6 pt-6 pb-4 flex-row items-center gap-3", isDark ? 'bg-gray-800' : 'bg-white')}>
              <Button size={"sm"} variant={"ghost"} onPress={() => {
                router.back();
              }} >
                <Ionicons name="arrow-back-outline" size={24} color="black" />
              </Button>
              <View className="px-6 pt-6 ">
                <Text className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  My Tasks
                </Text>
                <Text className={`text-md ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {tasks.length === 0 ? 'Ready to get started?' : `Keep up the great work!`}
                </Text>
              </View>
            </View>

            {/* Stats Overview */}
            <View className="px-6 mb-6">
              <Card className={`${isDark ? 'bg-gray-900/50 border-gray-700/50' : 'bg-white/90 border-gray-200/50'} backdrop-blur-md shadow-xl`}>
                <CardContent className="p-6">
                  <View className="mb-6">
                    <Text className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Progress Overview
                    </Text>
                    <Progress value={completionRate} indicatorClassName={isDark ? 'bg-blue-400' : 'bg-blue-600'} />
                    <View className="flex-row justify-between mt-2">
                      <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {completionRate.toFixed(0)}% Complete
                      </Text>
                      <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {completedTasks} of {tasks.length}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row">
                    <StatCard
                      title="Total Tasks"
                      value={tasks.length}
                      subtitle="All tasks"
                      color={isDark ? 'text-blue-400' : 'text-blue-600'}
                    />
                    <StatCard
                      title="Completed"
                      value={completedTasks}
                      subtitle="Finished"
                      color={isDark ? 'text-green-400' : 'text-green-600'}
                    />
                    <StatCard
                      title="Pending"
                      value={tasks.length - completedTasks}
                      subtitle="To do"
                      color={isDark ? 'text-orange-400' : 'text-orange-600'}
                    />
                  </View>
                </CardContent>
              </Card>
            </View>

            {/* Tasks Section Header */}
            <View className="px-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Tasks
                </Text>
                {tasks.length > 0 && (
                  <View className={`px-3 py-1 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {tasks.length} total
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={() => (
          <View className="items-center py-16 px-6">
            <View className={`w-24 h-24 rounded-full items-center justify-center mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Text className="text-4xl">📝</Text>
            </View>
            <Text className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              No tasks yet
            </Text>
            <Text className={`text-center px-8 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Create your first task to get started on your productivity journey
            </Text>
            <Button size={"sm"} variant={"outline"} onPress={() => { }} >
              <Text className="text-sm">Create Task</Text>
            </Button>
          </View>
        )}
        renderItem={({ item }) => (
          <View className="px-6 mb-3">
            <TodoCard
              task={item}
              milestoneMap={milestoneMap}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
              onPress={() => openTodoDetails(item)}
              isDark={isDark}
            />
          </View>
        )}
      />

      {/* Todo Details Modal */}
      <TodoDetailsModal
        task={modalState.todoDetails.task}
        isOpen={modalState.todoDetails.isOpen}
        onClose={closeTodoDetails}
        onEdit={async (task) => {
          // TODO: Implement edit functionality
          router.push({ pathname: '/todos/details/[id]', params: { id: task.id } });
        }}
        milestoneMap={milestoneMap}
      />
    </SafeAreaView>
  );
}