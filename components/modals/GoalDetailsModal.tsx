import React from 'react';
import { View, Alert } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button, buttonTextVariants } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { BottomSheet, BottomSheetCloseTrigger, BottomSheetContent, BottomSheetHeader, BottomSheetView, useBottomSheet } from '~/components/deprecated-ui/bottom-sheet';
import { useColorScheme } from '@/lib/useColorScheme';
import { useHandlers } from '@/hooks/data-provider';
import { Ionicons } from '@expo/vector-icons';
import type { Goal } from '@/lib/types';
import { getPriorityColor, getStatusColor } from '@/lib/utils';

interface GoalDetailsModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (goal: Goal) => void;
}

export default function GoalDetailsModal({ goal, isOpen, onClose, onEdit }: GoalDetailsModalProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { updateGoal, deleteGoal } = useHandlers();
  const { ref, open, close } = useBottomSheet();

  React.useEffect(() => {
    if (isOpen && goal) {
      open();
    } else {
      close();
    }
  }, [isOpen, goal, open, close]);

  if (!goal) return null;

  const handleToggleComplete = async () => {
    try {
      await updateGoal({ 
        id: goal.id, 
        status: goal.status === 'completed' ? 'in_progress' : 'completed', 
        updatedAt: new Date().toISOString() 
      });
    } catch {
      Alert.alert('Error', 'Failed to update goal');
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Goal', 'Are you sure you want to delete this goal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteGoal(goal.id);
            onClose();
          } catch {
            Alert.alert('Error', 'Failed to delete goal');
          }
        },
      },
    ]);
  };

 

  

  return (
    <BottomSheet>
      <BottomSheetContent 
        ref={ref}
        snapPoints={['60%', '90%']} 
        enablePanDownToClose={true}
        onDismiss={onClose}
      >
        <BottomSheetHeader>
          <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Goal Details
          </Text>
          <BottomSheetCloseTrigger />
        </BottomSheetHeader>
        
        <BottomSheetView hadHeader className="gap-4">
          {/* Goal Header */}
          <Card className={isDark ? 'bg-gray-800' : 'bg-white'}>
            <CardHeader className="gap-3">
              <View className="flex-row items-center justify-between">
                <CardTitle className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {goal.title}
                </CardTitle>
                <Checkbox 
                  checked={goal.status === 'completed'} 
                  onCheckedChange={handleToggleComplete} 
                />
              </View>
              
              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-2">
                  <View 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getPriorityColor(goal.priority) }}
                  />
                  <Text className={`text-sm capitalize ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {goal.priority} priority
                  </Text>
                </View>
                
                <View className="flex-row items-center gap-2">
                  <View 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getStatusColor(goal.status) }}
                  />
                  <Text className={`text-sm capitalize ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {goal.status.replace('_', ' ')}
                  </Text>
                </View>
              </View>
            </CardHeader>
            
            <CardContent className="gap-3">
              {goal.description && (
                <Text className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {goal.description}
                </Text>
              )}
              
              <View className="flex-row items-center gap-2">
                <Ionicons name="calendar-outline" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {goal.startDate && goal.targetEndDate 
                    ? `${new Date(goal.startDate).toLocaleDateString()} - ${new Date(goal.targetEndDate).toLocaleDateString()}`
                    : 'No dates set'
                  }
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card className={isDark ? 'bg-gray-800' : 'bg-white'}>
            <CardHeader>
              <CardTitle className={`text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Additional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-3">
              {goal.category && (
                <View className="flex-row items-center gap-2">
                  <Ionicons name="folder-outline" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Category: {goal.category}
                  </Text>
                </View>
              )}
              
              {goal.budget && (
                <View className="flex-row items-center gap-2">
                  <Ionicons name="cash-outline" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Budget: ${goal.budget}
                  </Text>
                </View>
              )}
              
              {goal.estimatedTotalHours && (
                <View className="flex-row items-center gap-2">
                  <Ionicons name="time-outline" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Estimated Hours: {goal.estimatedTotalHours}h
                  </Text>
                </View>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <View className="flex-row gap-3 pt-4">
            <Button 
              variant="outline" 
              onPress={() => onEdit(goal)}
              className="flex-1"
            >
              <Text className={buttonTextVariants({ variant: 'outline' })}>Edit</Text>
            </Button>
            
            <Button 
              variant="outline" 
              onPress={handleToggleComplete}
              className="flex-1"
            >
              <Text className={buttonTextVariants({ variant: 'outline' })}>
                {goal.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
              </Text>
            </Button>
            
            <Button 
              variant="destructive" 
              onPress={handleDelete}
              className="flex-1"
            >
              <Text className={buttonTextVariants({ variant: 'destructive' })}>Delete</Text>
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheetContent>
    </BottomSheet>
  );
}
