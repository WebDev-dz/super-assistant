import React, { useCallback, useMemo, useState } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, Alert, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button, buttonTextVariants } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import GoalCard from '@/components/cards/GoalCard';
import GoalsFlowModal from '@/components/GoalFormFlow';
import { useHandlers } from '@/hooks/data-provider';
import { useColorScheme } from '@/lib/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const { state, isLoading, error, updateGoal, deleteGoal } = useHandlers();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [refreshing, setRefreshing] = useState(false);

  const goals = state.goals ?? [];
  const milestones = state.milestones ?? [];
  const tasks = state.tasks ?? [];

  const stats = useMemo(() => {
    const total = goals.length;
    const completed = goals.filter(g => g.status === 'completed').length;
    const inProgress = goals.filter(g => g.status === 'in_progress').length;
    return { total, completed, inProgress };
  }, [goals]);

  const onRefresh = useCallback(async () => {
    // InstantDB hooks are reactive; a manual refetch isn't required.
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const handleComplete = async (goal: any) => {
    try {
      await updateGoal({ id: goal.id, status: 'completed', updatedAt: new Date().toISOString() });
    } catch (e) {
      Alert.alert('Error', 'Failed to mark goal as completed');
    }
  };

  const handleDelete = async (goal: any) => {
    Alert.alert('Delete Goal', 'Are you sure you want to delete this goal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteGoal(goal.id);
          } catch (e) {
            Alert.alert('Error', 'Failed to delete goal');
          }
        },
      },
    ]);
  };

  const renderHeader = () => (
    <View className="px-4 pt-6 pb-4">
      <Text className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Overview</Text>
      <View className="gap-4">
        {/* Todos Summary */}
        <Pressable onPress={() => router.push('/(app)/todos/index')}>
          <Card className="rounded-xl">
            <CardContent className="py-4">
              <View className="flex-row items-center justify-between">
                <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Todos</Text>
                <Text className="text-sm text-muted-foreground">View all</Text>
              </View>
              <View className="flex-row gap-3 mt-3">
                <View className="flex-1">
                  <Text className="text-xs text-muted-foreground">Total</Text>
                  <Text className="text-xl font-semibold">{tasks.length}</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </Pressable>

        {/* Milestones Summary */}
        {/* <Pressable onPress={() => router.push('/a/milestones/index')}>
          <Card className="rounded-xl">
            <CardContent className="py-4">
              <View className="flex-row items-center justify-between">
                <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Milestones</Text>
                <Text className="text-sm text-muted-foreground">View all</Text>
              </View>
              <View className="flex-row gap-3 mt-3">
                <View className="flex-1">
                  <Text className="text-xs text-muted-foreground">Total</Text>
                  <Text className="text-xl font-semibold">{milestones.length}</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </Pressable> */}

        {/* Goals Summary */}
        <Pressable onPress={() => router.push('/(app)/goals/index')}>
          <Card className="rounded-xl">
            <CardContent className="py-4">
              <View className="flex-row items-center justify-between">
                <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Goals</Text>
                <Text className="text-sm text-muted-foreground">View all</Text>
              </View>
              <View className="flex-row gap-3 mt-3">
                <View className="flex-1">
                  <Text className="text-xs text-muted-foreground">Total</Text>
                  <Text className="text-xl font-semibold">{stats.total}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-muted-foreground">In Progress</Text>
                  <Text className="text-xl font-semibold">{stats.inProgress}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-muted-foreground">Completed</Text>
                  <Text className="text-xl font-semibold">{stats.completed}</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </Pressable>
      </View>
    </View>
  );

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
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => (
          <View className="items-center justify-center px-8 py-12">
            <Text className={`text-base mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No goals yet</Text>
            <GoalsFlowModal />
          </View>
        )}
        renderItem={({ item }) => (
          <GoalCard
            goal={item as any}
            onPress={() => router.push({ pathname: '/(app)/goals/[id]', params: { id: item.id } })}
            onEdit={() => {}}
            onComplete={handleComplete}
            onDelete={handleDelete}
          />
        )}
      />
    </SafeAreaView>
  );
}
