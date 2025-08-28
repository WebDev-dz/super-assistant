import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GoalsPage = () => {
  const [habits, setHabits] = useState([
    {
      id: 1,
      title: 'Make UI/UX design portfolio',
      schedule: 'MTWRFSS',
      completedDays: ['M', 'W', 'F'],
      time: '09:00 AM',
    },
    {
      id: 2,
      title: 'Learn Figma design',
      schedule: 'MTWRFSS',
      completedDays: ['M', 'T', 'W', 'R', 'F', 'S', 'S'],
      time: 'No reminder',
    },
    {
      id: 3,
      title: 'Build my own Design System',
      schedule: 'MWFS',
      completedDays: ['T', 'W', 'S'],
      time: '14:00 PM',
    },
  ]);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Find a UI/UX design online course',
      date: 'Today, Dec 22, 2024',
      time: '16:00 PM',
    },
    {
      id: 2,
      title: 'Join a UI/UX design community',
      date: '20 Jan, 2025',
      time: 'No reminder',
    },
  ]);

  const renderHabitDay = (day, isCompleted, habitId) => (
    <TouchableOpacity
      key={day}
      className={`w-8 h-8 rounded-full items-center justify-center mr-2 ${
        isCompleted ? 'bg-orange-500' : 'bg-gray-200'
      }`}
      onPress={() => toggleHabitDay(habitId, day)}
    >
      <Text
        className={`text-sm font-medium ${
          isCompleted ? 'text-white' : 'text-gray-600'
        }`}
      >
        {day}
      </Text>
    </TouchableOpacity>
  );

  const toggleHabitDay = (habitId, day) => {
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          const updatedDays = habit.completedDays.includes(day)
            ? habit.completedDays.filter(d => d !== day)
            : [...habit.completedDays, day];
          return { ...habit, completedDays: updatedDays };
        }
        return habit;
      })
    );
  };

  const HabitCard = ({ habit }) => (
    <View className="bg-white border-l-4 border-orange-500 mb-4 p-4 rounded-r-lg shadow-sm">
      <Text className="text-base font-medium text-gray-900 mb-3">
        {habit.title}
      </Text>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          {['M', 'T', 'W', 'R', 'F', 'S', 'S'].map(day =>
            renderHabitDay(day, habit.completedDays.includes(day), habit.id)
          )}
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-500 ml-1">{habit.time}</Text>
        </View>
      </View>
    </View>
  );

  const TaskCard = ({ task }) => (
    <View className="bg-white border-l-4 border-blue-500 mb-4 p-4 rounded-r-lg shadow-sm">
      <Text className="text-base font-medium text-gray-900 mb-2">
        {task.title}
      </Text>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-500 ml-2">{task.date}</Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-500 ml-1">{task.time}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Header */}
      <View className="bg-white px-4 py-4 shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">
            AI-made Goals
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Goal Title */}
        <View className="py-6">
          <Text className="text-2xl font-bold text-gray-900">
            Become a UI/UX Designer
          </Text>
        </View>

        {/* Habits Section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Habit (...)
            </Text>
            <TouchableOpacity>
              <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {habits.map(habit => (
            <HabitCard key={habit.id} habit={habit} />
          ))}

          <TouchableOpacity className="flex-row items-center justify-center py-4">
            <Ionicons name="add" size={20} color="#EA580C" />
            <Text className="text-orange-600 font-medium ml-2">Add Habit</Text>
          </TouchableOpacity>
        </View>

        {/* Tasks Section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Task (...)
            </Text>
            <TouchableOpacity>
              <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}

          <TouchableOpacity className="flex-row items-center justify-center py-4">
            <Ionicons name="add" size={20} color="#EA580C" />
            <Text className="text-orange-600 font-medium ml-2">Add Task</Text>
          </TouchableOpacity>
        </View>

        {/* Note Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Note</Text>
          <View className="bg-white p-4 rounded-lg shadow-sm">
            <Text className="text-gray-700 leading-6">
              To achieve the goal of becoming a UI/UX Designer, it's essential to follow key steps 
              in the journey. Begin by researching various career paths within the field and 
              identifying areas of specialization.
            </Text>
          </View>
        </View>

        {/* Generating Plan Indicator */}
        <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <View className="flex-row items-center">
            <View className="w-6 h-6 mr-3">
              <View className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <View className="w-3 h-3 bg-orange-400 rounded-full mt-1 ml-1 animate-pulse" />
            </View>
            <Text className="text-gray-600 font-medium">Generating plan...</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="bg-white px-4 py-4 shadow-lg">
        <View className="flex-row space-x-4">
          <TouchableOpacity className="flex-1 py-3 px-4 border border-orange-600 rounded-lg">
            <Text className="text-orange-600 font-semibold text-center">
              Regenerate
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 py-3 px-4 bg-orange-600 rounded-lg">
            <Text className="text-white font-semibold text-center">
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GoalsPage;