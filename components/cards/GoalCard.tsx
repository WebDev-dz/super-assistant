import { GoalSchema } from "@/lib/validations";
import z from "zod";
import React from "react";
import {
  View,
  Text,
  Pressable,
} from "react-native";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type Goal = z.infer<typeof GoalSchema>;

interface GoalCardProps {
  goal: Goal;
  onPress: (goal: Goal) => void;
  onLongPress?: (goal: Goal) => void;
  onDelete?: (goal: Goal) => void;
  onEdit?: (goal: Goal) => void;
  onComplete?: (goal: Goal) => void;
  onArchive?: (goal: Goal) => void;
  compact?: boolean;
  showActions?: boolean;
}

// Status badge styling
const getStatusStyle = (status: Goal['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/20 border border-green-500/30';
    case 'in_progress':
      return 'bg-blue-500/20 border border-blue-500/30';
    case 'on_hold':
      return 'bg-yellow-500/20 border border-yellow-500/30';
    case 'cancelled':
      return 'bg-red-500/20 border border-red-500/30';
    default:
      return 'bg-gray-500/20 border border-gray-500/30';
  }
};

const getStatusTextStyle = (status: Goal['status']) => {
  switch (status) {
    case 'completed':
      return 'text-green-600 dark:text-green-400';
    case 'in_progress':
      return 'text-blue-600 dark:text-blue-400';
    case 'on_hold':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'cancelled':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

// Priority badge styling
const getPriorityStyle = (priority: Goal['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-500/20 border border-red-500/30';
    case 'high':
      return 'bg-orange-500/20 border border-orange-500/30';
    case 'medium':
      return 'bg-yellow-500/20 border border-yellow-500/30';
    case 'low':
      return 'bg-green-500/20 border border-green-500/30';
    default:
      return 'bg-gray-500/20 border border-gray-500/30';
  }
};

const getPriorityTextStyle = (priority: Goal['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'text-red-600 dark:text-red-400';
    case 'high':
      return 'text-orange-600 dark:text-orange-400';
    case 'medium':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'low':
      return 'text-green-600 dark:text-green-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

// Format date helper
const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Invalid date';
  }
};

// Check if goal is overdue
const isOverdue = (targetEndDate: string, status: Goal['status']) => {
  if (status === 'completed' || status === 'cancelled') return false;
  return new Date(targetEndDate) < new Date();
};

export default function GoalCard({
  goal,
  onPress,
  onLongPress,
  onDelete,
  onEdit,
  onComplete,
  onArchive,
  compact = false,
  showActions = true,
}: GoalCardProps) {
  const overdue = isOverdue(goal.targetEndDate, goal.status);
  
  return (
    <Pressable
      className={`
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700
        rounded-xl p-4 mb-3 mx-1
        shadow-sm
        active:scale-[0.98]
        ${overdue && goal.status !== 'completed' ? 'border-red-200 dark:border-red-800' : ''}
        ${goal.status === 'completed' ? 'opacity-75' : ''}
      `}
      onPress={() => onPress(goal)}
      onLongPress={() => onLongPress?.(goal)}
    >
      {/* Title */}
      <View className="mb-3">
        <Text 
          className="text-lg font-semibold text-gray-900 dark:text-white mb-1" 
          numberOfLines={2}
        >
          {goal.title}
        </Text>
        {goal.category && !compact && (
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {goal.category}
          </Text>
        )}
      </View>

      {/* Status and Priority Badges */}
      <View className="flex-row space-x-2 mb-3">
        <Badge className={getStatusStyle(goal.status)}>
          <Text className={`text-xs font-medium ${getStatusTextStyle(goal.status)}`}>
            {goal.status.replace('_', ' ')}
          </Text>
        </Badge>
        <Badge className={getPriorityStyle(goal.priority)}>
          <Text className={`text-xs font-medium ${getPriorityTextStyle(goal.priority)}`}>
            {goal.priority}
          </Text>
        </Badge>
      </View>

      {/* Description */}
      {goal.description && !compact && (
        <Text 
          className="text-sm text-gray-600 dark:text-gray-300 mb-3" 
          numberOfLines={3}
        >
          {goal.description}
        </Text>
      )}

      {/* Date Info */}
      <View className="space-y-1 mb-3">
        <View className="flex-row items-center">
          <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Due: {formatDate(goal.targetEndDate)}
          </Text>
          {overdue && goal.status !== 'completed' && (
            <View className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900 rounded">
              <Text className="text-xs font-medium text-red-600 dark:text-red-400">
                OVERDUE
              </Text>
            </View>
          )}
        </View>
        {!compact && (
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            Started: {formatDate(goal.startDate)}
          </Text>
        )}
      </View>

      {/* Resources */}
      {!compact && (goal.budget || goal.estimatedTotalHours) && (
        <View className="flex-row space-x-4 py-2 mb-3 border-t border-gray-100 dark:border-gray-700">
          {goal.budget && (
            <View className="flex-row items-center">
              <Text className="text-xs font-medium text-gray-600 dark:text-gray-400 mr-1">
                Budget:
              </Text>
              <Text className="text-xs text-gray-800 dark:text-gray-300">
                ${goal.budget.toLocaleString()}
              </Text>
            </View>
          )}
          {goal.estimatedTotalHours && (
            <View className="flex-row items-center">
              <Text className="text-xs font-medium text-gray-600 dark:text-gray-400 mr-1">
                Est:
              </Text>
              <Text className="text-xs text-gray-800 dark:text-gray-300">
                {goal.estimatedTotalHours}h
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Tags */}
      {!compact && goal.tags && goal.tags.length > 0 && (
        <View className="flex-row flex-wrap gap-1 mb-3">
          {goal.tags.slice(0, 4).map((tag, index) => (
            <View 
              key={index} 
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
            >
              <Text className="text-xs text-gray-600 dark:text-gray-300">
                #{tag}
              </Text>
            </View>
          ))}
          {goal.tags.length > 4 && (
            <View className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
              <Text className="text-xs text-gray-600 dark:text-gray-300">
                +{goal.tags.length - 4}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Actions */}
      {showActions && (
        <View className="flex-row justify-end gap-3 items-center pt-3 border-t border-gray-100 dark:border-gray-700">
          <View className="flex-row space-x-2">
            {onEdit && (
              <Pressable
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg active:opacity-70"
                onPress={(e) => {
                  e.stopPropagation();
                  onEdit(goal);
                }}
              >
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Edit
                </Text>
              </Pressable>
            )}
            
            {goal.status !== 'completed' && onComplete && (
              <Pressable
                className="px-3 py-1.5 bg-green-100 dark:bg-green-900 rounded-lg active:opacity-70"
                onPress={(e) => {
                  e.stopPropagation();
                  onComplete(goal);
                }}
              >
                <Text className="text-sm font-medium text-green-600 dark:text-green-400">
                  Complete
                </Text>
              </Pressable>
            )}
          </View>

          <View className="flex-row space-x-2">
            {onArchive && (
              <Pressable
                className="px-3 py-1.5 rounded-lg active:opacity-70"
                onPress={(e) => {
                  e.stopPropagation();
                  onArchive(goal);
                }}
              >
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Archive
                </Text>
              </Pressable>
            )}
            
            {onDelete && (
               <Pressable
                className="px-3 py-1.5 bg-red-100 dark:bg-green-900 rounded-lg active:opacity-70"
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete(goal);
                }}
              >
                <Text className="text-sm font-medium text-red-600 dark:text-red-400">
                  Delete
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
    </Pressable>
  );
}