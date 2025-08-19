import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
import { Badge } from '~/components/ui/badge';
import { Card } from '~/components/ui/card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/lib/useColorScheme';

// Enhanced categories with icons and colors (same as form)
const categories = [
  { 
    value: 'personal', 
    label: 'Personal', 
    icon: 'person-outline' as keyof typeof Ionicons.glyphMap,
    color: '#8B5CF6',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600'
  },
  { 
    value: 'career', 
    label: 'Career', 
    icon: 'briefcase-outline' as keyof typeof Ionicons.glyphMap,
    color: '#3B82F6',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600'
  },
  { 
    value: 'health', 
    label: 'Health & Fitness', 
    icon: 'fitness-outline' as keyof typeof Ionicons.glyphMap,
    color: '#10B981',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600'
  },
  { 
    value: 'education', 
    label: 'Education', 
    icon: 'school-outline' as keyof typeof Ionicons.glyphMap,
    color: '#F59E0B',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-600'
  },
  { 
    value: 'finance', 
    label: 'Finance', 
    icon: 'card-outline' as keyof typeof Ionicons.glyphMap,
    color: '#EF4444',
    bgColor: 'bg-red-100',
    textColor: 'text-red-600'
  },
  { 
    value: 'business', 
    label: 'Business', 
    icon: 'business-outline' as keyof typeof Ionicons.glyphMap,
    color: '#6366F1',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-600'
  },
  { 
    value: 'relationships', 
    label: 'Relationships', 
    icon: 'heart-outline' as keyof typeof Ionicons.glyphMap,
    color: '#EC4899',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-600'
  },
  { 
    value: 'travel', 
    label: 'Travel', 
    icon: 'airplane-outline' as keyof typeof Ionicons.glyphMap,
    color: '#14B8A6',
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-600'
  },
];

// Sample goal data
const sampleGoal = {
  id: '1',
  title: 'Complete Full Stack Web Development Bootcamp',
  description: 'Master modern web development technologies including React, Node.js, and databases. Build a portfolio of projects and prepare for a career transition into tech.',
  category: 'education',
  status: 'in_progress',
  priority: 'high',
  startDate: '2024-01-15',
  targetEndDate: '2024-06-30',
  budget: 3500,
  estimatedTotalHours: 400,
  currentProgress: 65,
  hoursCompleted: 260,
  createdAt: '2024-01-10',
  updatedAt: '2024-03-15'
};

// Status configurations
const statusConfig = {
  not_started: { color: 'bg-gray-100 text-gray-700', icon: 'pause-circle-outline' },
  in_progress: { color: 'bg-blue-100 text-blue-700', icon: 'play-circle-outline' },
  on_hold: { color: 'bg-yellow-100 text-yellow-700', icon: 'time-outline' },
  completed: { color: 'bg-green-100 text-green-700', icon: 'checkmark-circle-outline' },
  cancelled: { color: 'bg-red-100 text-red-700', icon: 'close-circle-outline' }
};

// Priority configurations
const priorityConfig = {
  low: { color: 'bg-gray-100 text-gray-700', icon: 'arrow-down' },
  medium: { color: 'bg-blue-100 text-blue-700', icon: 'remove' },
  high: { color: 'bg-orange-100 text-orange-700', icon: 'arrow-up' },
  urgent: { color: 'bg-red-100 text-red-700', icon: 'warning' }
};

interface GoalDetailsScreenProps {
  goalId?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
}

export default function GoalDetailsScreen({ 
  goalId, 
  onEdit, 
  onDelete, 
  onBack 
}: GoalDetailsScreenProps) {
  const [goal] = useState(sampleGoal);
  const [showActions, setShowActions] = useState(false);
  
  const category = categories.find(cat => cat.value === goal.category);
  const statusInfo = statusConfig[goal.status as keyof typeof statusConfig];
  const priorityInfo = priorityConfig[goal.priority as keyof typeof priorityConfig];

  const  {colorScheme}  = useColorScheme();
  const isDark = colorScheme === 'dark';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDaysRemaining = () => {
    const endDate = new Date(goal.targetEndDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDeleteGoal = () => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            onDelete?.();
          }
        }
      ]
    );
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className={`flex-1  ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-4 flex-row items-center justify-between">
        <TouchableOpacity 
          onPress={onBack}
          className="p-2 -ml-2"
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        
        <Text className="text-lg font-semibold text-gray-900 flex-1 text-center mr-10">
          Goal Details
        </Text>
        
        <TouchableOpacity 
          onPress={() => setShowActions(!showActions)}
          className="p-2 -mr-2"
        >
          <Ionicons name="ellipsis-vertical" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Action Menu */}
      {showActions && (
        <View className="absolute top-20 right-4 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-[120px]">
          <TouchableOpacity 
            onPress={() => {
              setShowActions(false);
              onEdit?.();
            }}
            className="flex-row items-center px-4 py-3 border-b border-gray-100"
          >
            <Ionicons name="create-outline" size={16} color="#6B7280" />
            <Text className="ml-2 text-gray-700">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              setShowActions(false);
              handleDeleteGoal();
            }}
            className="flex-row items-center px-4 py-3"
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
            <Text className="ml-2 text-red-600">Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Main Goal Info */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm border border-gray-100">
          {/* Category Badge */}
          {category && (
            <View className="flex-row items-center mb-4">
              <View className={`w-8 h-8 rounded-full ${category.bgColor} items-center justify-center mr-3`}>
                <Ionicons name={category.icon} size={16} color={category.color} />
              </View>
              <Text className={`text-sm font-medium ${category.textColor}`}>
                {category.label}
              </Text>
            </View>
          )}

          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
            {goal.title}
          </Text>

          {/* Status and Priority Badges */}
          <View className="flex-row gap-2 mb-4">
            <View className={`px-3 py-1 rounded-full ${statusInfo.color} flex-row items-center`}>
              <Ionicons name={statusInfo.icon as keyof typeof Ionicons.glyphMap} size={12} />
              <Text className="ml-1 text-xs font-medium capitalize">
                {goal.status.replace('_', ' ')}
              </Text>
            </View>
            <View className={`px-3 py-1 rounded-full ${priorityInfo.color} flex-row items-center`}>
              <Ionicons name={priorityInfo.icon as keyof typeof Ionicons.glyphMap} size={12} />
              <Text className="ml-1 text-xs font-medium capitalize">
                {goal.priority} Priority
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text className="text-gray-600 leading-relaxed">
            {goal.description}
          </Text>
        </View>

        {/* Progress Section */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</Text>
          
          {/* Progress Bar */}
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-medium text-gray-700">Completion</Text>
              <Text className="text-sm font-semibold text-purple-600">{goal.currentProgress}%</Text>
            </View>
            <View className="h-2 bg-gray-200 rounded-full">
              <View 
                className="h-2 bg-purple-600 rounded-full"
                style={{ width: `${goal.currentProgress}%` }}
              />
            </View>
          </View>

          {/* Progress Stats */}
          <View className="flex-row justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">{goal.hoursCompleted}</Text>
              <Text className="text-sm text-gray-600">Hours Completed</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-gray-900">{goal.estimatedTotalHours - goal.hoursCompleted}</Text>
              <Text className="text-sm text-gray-600">Hours Remaining</Text>
            </View>
            <View className="flex-1 items-end">
              <Text className={`text-2xl font-bold ${daysRemaining > 0 ? 'text-gray-900' : 'text-red-600'}`}>
                {Math.abs(daysRemaining)}
              </Text>
              <Text className="text-sm text-gray-600">
                Days {daysRemaining > 0 ? 'Remaining' : 'Overdue'}
              </Text>
            </View>
          </View>
        </View>

        {/* Timeline Section */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Timeline</Text>
          
          <View className="space-y-4">
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-green-500 rounded-full mr-4" />
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-900">Start Date</Text>
                <Text className="text-sm text-gray-600">{formatDate(goal.startDate)}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-purple-500 rounded-full mr-4" />
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-900">Target End Date</Text>
                <Text className="text-sm text-gray-600">{formatDate(goal.targetEndDate)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Budget Section */}
        {goal.budget && (
          <View className="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Budget</Text>
            
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="wallet-outline" size={24} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900">${goal.budget.toLocaleString()}</Text>
                <Text className="text-sm text-gray-600">Allocated Budget</Text>
              </View>
            </View>
          </View>
        )}

        {/* Actions */}
        <View className="mx-4 mt-6 mb-8 gap-3">
          <Button 
            onPress={onEdit}
            className="bg-purple-600 py-4 rounded-xl"
          >
            <Text className="text-white font-semibold text-center">Edit Goal</Text>
          </Button>
          
          <Button 
            variant="outline"
            onPress={() => {
              // Add to calendar logic here
              Alert.alert('Success', 'Goal milestones added to your calendar!');
            }}
            className="border-purple-600 py-4 rounded-xl"
          >
            <Text className="text-purple-600 font-semibold text-center">Add to Calendar</Text>
          </Button>
        </View>
      </ScrollView>

      {/* Backdrop for action menu */}
      {showActions && (
        <TouchableOpacity 
          className="absolute inset-0 bg-black bg-opacity-20"
          onPress={() => setShowActions(false)}
          activeOpacity={1}
        />
      )}
    </SafeAreaView>
  );
}