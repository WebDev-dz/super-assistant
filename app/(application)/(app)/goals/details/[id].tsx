import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Card } from '~/components/ui/card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/lib/useColorScheme';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Sample meditation goal data
const sampleMeditationGoal = {
  id: '1',
  title: 'Daily Meditation',
  category: 'health',
  startDate: '2024-01-01',
  targetEndDate: '2025-12-25',
  targetTime: '08:00 AM',
  description: 'Develop a consistent meditation practice for mental clarity and stress reduction',
  habits: [
    {
      id: '1',
      title: 'Morning Meditation Routine',
      days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      time: '07:00 AM',
      reminder: true
    },
    {
      id: '2',
      title: 'Evening Wind-Down',
      days: ['M', 'T', 'W', 'T', 'F', 'S'],
      time: '16:00 PM',
      reminder: true
    },
    {
      id: '3',
      title: 'Breathing Exercises',
      days: ['M', 'T', 'W', 'T', 'F', 'S'],
      time: 'No reminder',
      reminder: false
    },
    {
      id: '4',
      title: 'Body Scan Meditation',
      days: ['M', 'T', 'W', 'T', 'F', 'S'],
      time: 'No reminder',
      reminder: false
    }
  ],
  tasks: [
    {
      id: '1',
      title: 'Set Daily Meditation Time',
      dueDate: 'Today, Dec 22, 2024',
      time: '10:00 AM',
      completed: false
    },
    {
      id: '2',
      title: 'Create Meditation Space',
      dueDate: 'Jan 08, 2025',
      time: '10:00 AM',
      completed: false
    },
    {
      id: '3',
      title: 'Experiment with Techniques',
      dueDate: 'Jan 15, 2025',
      time: '08:00 AM',
      completed: false
    },
    {
      id: '4',
      title: 'Attend Meditation Classes',
      dueDate: 'Jan 20, 2025',
      time: '10:00 AM',
      completed: false
    }
  ],
  notes: [
    'Be patient: Learning meditation takes time and practice. Don\'t get discouraged if you find it difficult to quiet your mind at first.',
    'Focus on the present moment: Don\'t worry about the past or future during meditation.',
    'Embrace distractions: When your mind wanders, gently bring it back to your breath without judgment.'
  ]
};

export default function GoalDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [goal] = useState(sampleMeditationGoal);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const calculateDaysRemaining = () => {
    const endDate = new Date(goal.targetEndDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    // Navigate to edit page or open edit modal
    Alert.alert('Edit', 'Edit functionality would go here');
  };

  const renderDayCircle = (day: string, isActive: boolean, index: number) => (
    <View 
      key={index}
      className={`w-8 h-8 rounded-full items-center justify-center mr-1 ${
        isActive ? 'bg-orange-500' : 'bg-white border border-orange-500'
      }`}
    >
      <Text className={`text-xs font-medium ${
        isActive ? 'text-white' : 'text-orange-500'
      }`}>
        {day}
      </Text>
    </View>
  );

  const renderHabitCard = (habit: any) => (
    <View key={habit.id} className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100">
      <Text className="text-base font-medium text-gray-900 mb-2">{habit.title}</Text>
      <View className="flex-row items-center justify-between">
        <View className="flex-row">
          {habit.days.map((day: string, index: number) => 
            renderDayCircle(day, habit.days.length === 7 || index < 6, index)
          )}
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text className="ml-1 text-sm text-gray-600">{habit.time}</Text>
        </View>
      </View>
    </View>
  );

  const renderTaskCard = (task: any) => (
    <View key={task.id} className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row items-start">
        <View className="w-1 h-full bg-blue-500 rounded-full mr-3 mt-1" />
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-900 mb-2">{task.title}</Text>
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <Text className="ml-1 text-sm text-gray-600">{task.dueDate}</Text>
            <View className="ml-4 flex-row items-center">
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text className="ml-1 text-sm text-gray-600">{task.time}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className={`flex-1 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-4 flex-row items-center justify-between">
        <TouchableOpacity 
          onPress={handleBack}
          className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        
        <Text className="text-xl font-bold text-gray-900 flex-1 text-center">
          Self-made Goals
        </Text>
        
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Illustrative Banner */}
        <View className="mx-4 mt-4 rounded-2xl overflow-hidden relative">
          <View className="w-full h-64 bg-gradient-to-b from-blue-600 via-blue-500 to-blue-400 relative">
            {/* Abstract background elements */}
            <View className="absolute top-4 right-4 w-20 h-20 bg-yellow-300 rounded-full opacity-80" />
            <View className="absolute top-16 left-8 w-16 h-16 bg-pink-300 rounded-full opacity-60" />
            <View className="absolute top-32 right-16 w-12 h-12 bg-purple-300 rounded-full opacity-70" />
            
            {/* Mountain range */}
            <View className="absolute bottom-0 left-0 right-0 h-16">
              <View className="absolute bottom-0 left-0 w-32 h-16 bg-pink-200 rounded-t-full" />
              <View className="absolute bottom-0 right-0 w-24 h-12 bg-white rounded-t-full" />
            </View>
            
            {/* Meditation person silhouette */}
            <View className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <View className="w-16 h-20 bg-gray-800 rounded-full" />
              <View className="w-12 h-16 bg-white rounded-full mx-auto mt-2" />
              <View className="w-8 h-12 bg-orange-500 rounded-full mx-auto mt-2" />
            </View>
            
            {/* Stars */}
            <View className="absolute top-8 left-16 w-2 h-2 bg-white rounded-full" />
            <View className="absolute top-12 right-20 w-1 h-1 bg-white rounded-full" />
            <View className="absolute top-20 left-24 w-1.5 h-1.5 bg-white rounded-full" />
            
            {/* Image change button */}
            <TouchableOpacity className="absolute bottom-4 right-4 w-12 h-12 bg-orange-500 rounded-full items-center justify-center">
              <Ionicons name="image-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Meditation Section */}
        <View className="mx-4 mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-900">Daily Meditation</Text>
            <TouchableOpacity onPress={handleEdit}>
              <Ionicons name="create-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row items-center mb-2">
            <Badge className="bg-green-100 border-green-200">
              <Text className="text-green-700 text-xs font-medium">Health</Text>
            </Badge>
            <View className="flex-row items-center ml-3">
              <Ionicons name="calendar-outline" size={16} color="#6B7280" />
              <Text className="ml-1 text-sm text-gray-600">D-{daysRemaining} days</Text>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text className="ml-1 text-sm text-gray-600">
              {goal.targetEndDate} - {goal.targetTime}
            </Text>
          </View>
        </View>

        {/* Habits Section */}
        <View className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-4">
            <Text className="text-lg font-bold text-gray-900">Habit ({goal.habits.length})</Text>
            <TouchableOpacity className="ml-2">
              <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          {goal.habits.map(renderHabitCard)}
          
          <Button 
            variant="outline"
            className="border-orange-500 py-3 rounded-lg mt-2"
          >
            <View className="flex-row items-center">
              <Ionicons name="add" size={20} color="#F97316" />
              <Text className="ml-2 text-orange-500 font-medium">Add Habit</Text>
            </View>
          </Button>
        </View>

        {/* Tasks Section */}
        <View className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-4">
            <Text className="text-lg font-bold text-gray-900">Task ({goal.tasks.length})</Text>
            <TouchableOpacity className="ml-2">
              <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          {goal.tasks.map(renderTaskCard)}
          
          <Button 
            variant="outline"
            className="border-orange-500 py-3 rounded-lg mt-2"
          >
            <View className="flex-row items-center">
              <Ionicons name="add" size={20} color="#F97316" />
              <Text className="ml-2 text-orange-500 font-medium">Add Task</Text>
            </View>
          </Button>
        </View>

        {/* Notes Section */}
        <View className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">Note</Text>
          
          <View className="bg-white rounded-lg p-4 border border-gray-100">
            {goal.notes.map((note, index) => (
              <View key={index} className="flex-row items-start mb-2 last:mb-0">
                <View className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3" />
                <Text className="flex-1 text-sm text-gray-700 leading-5">{note}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Create Goals Button */}
        <View className="mx-4 mt-6 mb-8">
          <Button 
            className="bg-orange-500 py-4 rounded-xl"
          >
            <Text className="text-white font-semibold text-center text-lg">Create Goals</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}