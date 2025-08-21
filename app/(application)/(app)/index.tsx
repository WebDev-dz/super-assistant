import React, { useCallback, useMemo, useState } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, Alert, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button, buttonTextVariants } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import GoalCard from '@/components/cards/GoalCard';
import GoalDetailsModal from '@/components/modals/GoalDetailsModal';
import { ChoiceModal, OptionButtonConfig } from '@/components/modals/ChoiceModal';
import { useHandlers } from '@/hooks/data-provider';
import { useColorScheme } from '@/lib/useColorScheme';
import { useModalManager } from '@/hooks/useModalManager';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RelativePathString, useRouter } from 'expo-router';
import { defaultGoal, defaultMilestone, defaultTask } from '@/lib/constants';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { OptionButtonProps } from '@/components/ui/option-button';
import TodoDetailsModal from '@/components/modals/TodoDetailsModal';
import TodoCard from '@/components/cards/TodoCard';
import { Progress } from '@/components/ui/progress';

export default function HomeScreen() {
  const router = useRouter();
  const { state, isLoading, error, updateGoal, deleteGoal } = useHandlers();
  const { colorScheme } = useColorScheme();
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const isDark = colorScheme === 'dark';
  const [refreshing, setRefreshing] = useState(false);
  const { modalState, openGoalDetails, closeTodoDetails, closeGoalDetails, openMilestoneDetails, openTodoDetails } = useModalManager();

  const goals = React.useMemo(() => state.goals ?? [], [state]);
  const milestones = React.useMemo(() => state.milestones ?? [], [state]);
  const tasks = React.useMemo(() => state.tasks ?? [], [state]);

  const milestoneMap = useMemo(() => {
    const map: Record<string, string> = {};
    milestones.forEach(m => { map[m.id] = m.title; });
    return map;
  }, [milestones]);

  const isProUser = useMemo(() => 
    user?.publicMetadata?.subscription === "pro" || 
    user?.publicMetadata?.isPro === true
  , [user]);

  const stats = useMemo(() => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const inProgressGoals = goals.filter(g => g.status === 'in_progress').length;
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    
    const goalCompletionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    return { 
      totalGoals, 
      completedGoals, 
      inProgressGoals,
      totalTasks,
      completedTasks,
      pendingTasks,
      goalCompletionRate,
      taskCompletionRate
    };
  }, [goals, tasks]);

  const currentUserRole = useMemo(() => 
    user?.publicMetadata?.subscription === "pro" || 
    user?.publicMetadata?.isPro === true ? "pro" : user ? "user" : "guest"
  , [user]);
  // Define choice modal options
  const choiceOptions: OptionButtonConfig[] = useMemo(() => [
    {
      optionKey: "goal",
      icon: "flag",
      title: "Goal",
      subtitle: "Long-term objective",
      isDark,
      role: currentUserRole,
      onPress: async (optionKey) => {
        // @ts-ignore
        openGoalDetails({goal: defaultGoal, mode: 'create'});
      }
    },
    {
      optionKey: "milestone", 
      icon: "trophy",
      title: "Milestone",
      subtitle: "Achievement marker",
      role: currentUserRole,
      isDark,
      onPress: async (optionKey) => {
        // @ts-ignore
        openMilestoneDetails({milestone: defaultMilestone, mode: 'create'});
      }
    },
    {
      role: currentUserRole,
      isDark,
      optionKey: "todo",
      icon: "checkmark-circle", 
      title: "Todo",
      subtitle: "Task to complete",
      onPress: async (optionKey) => {
        // @ts-ignore
        openTodoDetails({task: defaultTask, mode: 'create'});
      }
    },
    {
      optionKey: "ai",
      role: currentUserRole,
      isDark,
      icon: {
        guest: "sparkles-outline",
        user: "sparkles-outline", 
        pro: "sparkles"
      },
      title: {
        guest: "AI Assistant",
        user: "AI Assistant (Pro)",
        pro: "AI Assistant"
      },
      subtitle: {
        guest: "Sign in to access AI features",
        user: "Upgrade to Pro for AI assistance",
        pro: "Create with AI assistance"
      },
      disabled: {
        guest: true,
        user: true,
        pro: false
      },
      onPress: {
        
        guest: async (optionKey) => {
          Alert.alert(
            "Sign In Required", 
            "Please sign in to access AI features",
            [{ text: "OK" }]
          );
        },
        user: async (optionKey) => {
          Alert.alert(
            "Pro Feature", 
            "Upgrade to Pro to access AI assistance",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Upgrade", onPress: () => {
                // TODO: Navigate to upgrade screen
                console.log("Navigate to upgrade");
              }}
            ]
          );
        },
        pro: async (optionKey) => {
          // TODO: Implement AI creation flow
          Alert.alert("AI Assistant", "AI creation feature coming soon!");
        }
      }
    }
  ], [openGoalDetails, openMilestoneDetails, openTodoDetails]);

  const onRefresh = useCallback(async () => {
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

  const handleOptionSelected = useCallback((optionKey: string, role: "guest" | "user" | "pro") => {
    console.log(`Selected ${optionKey} as ${role}`);
    // Additional tracking or analytics can be added here
  }, []);

  const renderGoalItem = ({ item }: { item: any }) => (
    <View className="w-80 mr-4">
      <GoalCard
        goal={item}
        onPress={() => openGoalDetails(item)}
        onDelete={handleDelete}
        onComplete={handleComplete}
        compact={true}
      />
    </View>
  );

  const renderTaskItem = ({ item }: { item: any }) => (
    <View className="w-72 mr-4">
      <TodoCard
        task={item}
        milestoneMap={milestoneMap}
        onToggleComplete={() => {}}
        onDelete={() => {}}
        onPress={() => openTodoDetails(item)}
        isDark={isDark}
      />
    </View>
  );

  

  const StatCard = ({ title, value, subtitle, progress, color, onPress }: any) => (
    <Pressable onPress={onPress}>
      <Card className={`rounded-2xl ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/90 border-gray-200/50'} backdrop-blur-md shadow-xl`}>
        <CardContent className="p-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </Text>
            <Text className="text-sm text-muted-foreground">View all</Text>
          </View>
          
          {progress !== undefined && (
            <View className="mb-4">
              <Progress value={progress} indicatorClassName={isDark ? 'bg-blue-400' : 'bg-blue-600'} />
              <Text className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {progress.toFixed(0)}% Complete
              </Text>
            </View>
          )}
          
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-xs text-muted-foreground">Total</Text>
              <Text className={`text-2xl font-bold ${color}`}>{value.total}</Text>
            </View>
            {value.completed !== undefined && (
              <View className="flex-1">
                <Text className="text-xs text-muted-foreground">Completed</Text>
                <Text className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  {value.completed}
                </Text>
              </View>
            )}
            {value.pending !== undefined && (
              <View className="flex-1">
                <Text className="text-xs text-muted-foreground">Pending</Text>
                <Text className={`text-2xl font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                  {value.pending}
                </Text>
              </View>
            )}
            {value.inProgress !== undefined && (
              <View className="flex-1">
                <Text className="text-xs text-muted-foreground">In Progress</Text>
                <Text className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {value.inProgress}
                </Text>
              </View>
            )}
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );


  const renderHeader = () => (
    <View>
      {/* Header Section */}
      <View className="px-6 pt-6 pb-4">
        <Text className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Welcome Back!
        </Text>
        <Text className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {stats.totalGoals === 0 && stats.totalTasks === 0 
            ? 'Ready to start your productivity journey?' 
            : 'Here\'s your progress overview'}
        </Text>
      </View>

     

      {/* Statistics Overview */}
      <View className="px-6 mb-6 gap-4">
        {/* Tasks Summary Card */}
        <StatCard
          title="Tasks"
          value={{
            total: stats.totalTasks,
            completed: stats.completedTasks,
            pending: stats.pendingTasks
          }}
          progress={stats.taskCompletionRate}
          color={isDark ? 'text-blue-400' : 'text-blue-600'}
          onPress={() => router.push('/todos/' as RelativePathString)}
        />

        {/* Goals Summary Card */}
        <StatCard
          title="Goals"
          value={{
            total: stats.totalGoals,
            completed: stats.completedGoals,
            inProgress: stats.inProgressGoals
          }}
          progress={stats.goalCompletionRate}
          color={isDark ? 'text-purple-400' : 'text-purple-600'}
          onPress={() => router.push('/goals/' as RelativePathString)}
        />
      </View>

      {/* Recent Goals Section */}
      {goals.length > 0 && (
        <View className="mb-6">
          <View className="px-6 mb-4">
            <View className="flex-row items-center justify-between">
              <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Recent Goals
              </Text>
              <Pressable onPress={() => router.push('/goals/' as RelativePathString)}>
                <Text className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  View All
                </Text>
              </Pressable>
            </View>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={goals.slice(0, 5)}
            keyExtractor={(item) => item.id}
            renderItem={renderGoalItem}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          />
        </View>
      )}

      {/* Recent Tasks Section */}
      {tasks.length > 0 && (
        <View className="mb-6">
          <View className="px-6 mb-4">
            <View className="flex-row items-center justify-between">
              <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Recent Tasks
              </Text>
              <Pressable onPress={() => router.push('/todos/' as RelativePathString)}>
                <Text className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  View All
                </Text>
              </Pressable>
            </View>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={tasks.slice(0, 5)}
            keyExtractor={(item) => item.id}
            renderItem={renderTaskItem}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          />
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <View className="items-center">
          <ActivityIndicator size="large" color={isDark ? '#8B5CF6' : '#7C3AED'} />
          <Text className={`mt-4 text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading your dashboard...
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
            Failed to load your dashboard. Please try again.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView  edges={[]} className={`flex-1 `}>
      <FlatList
        data={[{ id: 'header' }]} // Just one item for the header
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 100 }} // Extra space for FAB
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={isDark ? '#8B5CF6' : '#7C3AED'}
          />
        }
        ListEmptyComponent={() => (
          <View className="items-center py-16 px-6">
            <View className={`w-24 h-24 rounded-full items-center justify-center mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Text className="text-4xl">🚀</Text>
            </View>
            <Text className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Ready to get started?
            </Text>
            <Text className={`text-center px-8 mb-6 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Create your first goal and start building productive habits
            </Text>
            <Text className={`text-center px-8 mb-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Tap the + button to create your first item
            </Text>
          </View>
        )}
        renderItem={() => null}
      />
      
      {/* Goal Details Modal */}
      <GoalDetailsModal
        {...modalState.goalDetails}
        onClose={closeGoalDetails}
        onEdit={(goal) => {
          // TODO: Implement edit functionality
          console.log('Edit goal:', goal);
        }}
      />

      {/*  Todo Details Modal */}
      <TodoDetailsModal
        {...modalState.todoDetails}
        onClose={closeTodoDetails}
        onEdit={async (task) => {
          // TODO: Implement edit functionality
          console.log('Edit task:', task);
        }}
        milestoneMap={milestoneMap}
      />

      {/* Choice Modal - Replaces both GoalsFlowModal and FloatingActionButton */}
      <ChoiceModal
        title={{
          guest: "Get Started",
          user: "Create New", 
          pro: "Create New"
        }}
        description={{
          guest: "Sign in to start creating",
          user: "What would you like to add?",
          pro: "What would you like to create?"
        }}
        options={choiceOptions}
        onOptionSelected={handleOptionSelected}
        role='guest'
      />
    </SafeAreaView>
  );
}