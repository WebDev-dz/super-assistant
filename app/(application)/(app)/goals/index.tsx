import React, { useCallback, useMemo, useState } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, Alert, useWindowDimensions } from 'react-native';
import { Text } from '~/components/ui/text';
import { useHandlers } from '@/hooks/data-provider';
import { useColorScheme } from '@/lib/useColorScheme';
import { useModalManager } from '@/hooks/useModalManager';
import GoalCard from '@/components/cards/GoalCard';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { LinearGradient } from 'expo-linear-gradient';

export default function GoalsListScreen({ route, navigation }: any) {
  const { state, isLoading, error, updateGoal, deleteGoal } = useHandlers();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  console.log({ route, navigation });
  console.log("GoalsScreen state:", state);

  const goals = React.useMemo(() => state.goals ?? [], [state]);
  console.warn("Goals:", goals);

  // Goal statistics
  const completedGoals = useMemo(() => goals.filter(g => g.status === 'completed').length, [goals]);
  const inProgressGoals = useMemo(() => goals.filter(g => g.status == "in_progress").length, [goals]);
  const notStartedGoals = useMemo(() => goals.filter(g => g.status == "not_started").length, [goals]);
  const completionRate = useMemo(() => 
    goals.length > 0 ? (completedGoals / goals.length) * 100 : 0, 
    [goals.length, completedGoals]
  );

  const { height: windowHeight } = useWindowDimensions();
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 400);
  }, []);

  const handleComplete = async (goal: any) => {
    try {
      await updateGoal({ 
        id: goal.id, 
        status: 'completed', 
        updatedAt: new Date().toISOString() 
      });
    } catch {
      Alert.alert('Error', 'Failed to update goal');
    }
  };

  const handleDelete = (goal: any) => {
    Alert.alert('Delete Goal', 'Are you sure you want to delete this goal?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { 
        try { 
          await deleteGoal(goal.id); 
        } catch {
          Alert.alert('Error', 'Failed to delete goal');
        } 
      }}
    ]);
  };

  if (isLoading) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <View className="items-center">
          <ActivityIndicator size="large" color={isDark ? '#3B82F6' : '#1D4ED8'} />
          <Text className={`mt-4 text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading your goals...
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
            Failed to load your goals. Please try again.
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

  const ProgressBar = ({ progress }: { progress: number }) => (
    <View className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
      <View 
        className="h-full rounded-full"
        style={{ 
          width: `${progress}%`,
          backgroundColor: isDark ? '#10B981' : '#059669'
        }}
      />
    </View>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className={`flex-1  ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Gradient Background */}
      {/* <LinearGradient
        colors={isDark ? ['rgba(16, 185, 129, 0.05)', 'transparent'] : ['rgba(16, 185, 129, 0.03)', 'transparent']}
        className="absolute top-0 left-0 right-0 h-80"
      /> */}
      
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ backgroundColor: "red" }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={isDark ? '#10B981' : '#059669'}
          />
        }
        ListHeaderComponent={() => (
          <View>
            {/* Header Section */}
            <View className="px-6 pt-6 pb-4">
              <Text className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                My Goals
              </Text>
              <Text className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {goals.length === 0 ? 'Ready to set your first goal?' : `Track your progress towards success!`}
              </Text>
            </View>

            {/* Stats Overview */}
            <View className="px-6 mb-6">
              <Card className={`${isDark ? 'bg-gray-900/50 border-gray-700/50' : 'bg-white/90 border-gray-200/50'} backdrop-blur-md shadow-xl`}>
                <CardContent className="p-6">
                  <View className="mb-6">
                    <Text className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Achievement Overview
                    </Text>
                    <ProgressBar progress={completionRate} />
                    <View className="flex-row justify-between mt-2">
                      <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {completionRate.toFixed(0)}% Achieved
                      </Text>
                      <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {completedGoals} of {goals.length}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="flex-row">
                    <StatCard
                      title="Total Goals"
                      value={goals.length}
                      subtitle="All goals"
                      color={isDark ? 'text-purple-400' : 'text-purple-600'}
                    />
                    <StatCard
                      title="Completed"
                      value={completedGoals}
                      subtitle="Achieved"
                      color={isDark ? 'text-green-400' : 'text-green-600'}
                    />
                    <StatCard
                      title="In Progress"
                      value={inProgressGoals}
                      subtitle="Active"
                      color={isDark ? 'text-blue-400' : 'text-blue-600'}
                    />
                  </View>
                  
                  {notStartedGoals > 0 && (
                    <View className="mt-4">
                      <StatCard
                        title="Not Started"
                        value={notStartedGoals}
                        subtitle="Ready to begin"
                        color={isDark ? 'text-orange-400' : 'text-orange-600'}
                      />
                    </View>
                  )}
                </CardContent>
              </Card>
            </View>

            {/* Goals Section Header */}
            <View className="px-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Goals
                </Text>
                {goals.length > 0 && (
                  <View className={`px-3 py-1 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {goals.length} total
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center py-16 px-6">
            <View className={`w-24 h-24 rounded-full items-center justify-center mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Text className="text-4xl">🎯</Text>
            </View>
            <Text className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              No goals yet
            </Text>
            <Text className={`text-center px-8 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Set your first goal and start your journey towards achieving your dreams
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View className="px-6 mb-3">
            <GoalCard
              goal={item as any}
              onPress={() => router.push({ pathname: '/goals/details/[id]', params: { id: (item as any).id } })}
              onEdit={() => {
                // TODO: Implement edit functionality
                console.log('Edit goal:', item);
              }}
              onComplete={() => handleComplete(item)}
              onDelete={() => handleDelete(item)}
              // isDark={isDark}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}