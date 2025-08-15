import React from 'react';
import { View, Alert } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button, buttonTextVariants } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { BottomSheet, BottomSheetCloseTrigger, BottomSheetContent, BottomSheetHeader, BottomSheetView, useBottomSheet } from '~/components/deprecated-ui/bottom-sheet';
import { useColorScheme } from '@/lib/useColorScheme';
import { useHandlers } from '@/hooks/data-provider';
import { Ionicons } from '@expo/vector-icons';
import type { Milestone } from '@/lib/types';
import { getPriorityColor, getStatusColor } from '@/lib/utils';

interface MilestoneDetailsModalProps {
  milestone: Milestone | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (milestone: Milestone) => void;
  onCreate?: (milestone: Milestone) => void;
  mode: 'create' | 'update';
  goalId?: string; // Required when creating a new milestone
}

export default function MilestoneDetailsModal({ 
  milestone, 
  isOpen, 
  onClose, 
  onEdit, 
  onCreate,
  mode,
  goalId 
}: MilestoneDetailsModalProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { updateMilestone, deleteMilestone, createMilestone } = useHandlers();
  const { ref, open, close } = useBottomSheet();

  React.useEffect(() => {
    if (isOpen && (mode === 'create' || milestone)) {
      open();
    } else {
      close();
    }
  }, [isOpen, milestone, mode, open, close]);

  if (!milestone) return null;

  const handleToggleComplete = async () => {
    try {
      await updateMilestone({ 
        id: milestone.id, 
        status: milestone.status === 'completed' ? 'in_progress' : 'completed', 
        updatedAt: new Date().toISOString() 
      });
    } catch {
      Alert.alert('Error', 'Failed to update milestone');
    }
  };

  const handleDelete = () => {
    if (mode !== 'update' || !milestone) return;
    
    Alert.alert('Delete Milestone', 'Are you sure you want to delete this milestone?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMilestone(milestone.id);
            onClose();
          } catch {
            Alert.alert('Error', 'Failed to delete milestone');
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
            Milestone Details
          </Text>
          <BottomSheetCloseTrigger />
        </BottomSheetHeader>
        
        <BottomSheetView hadHeader className="gap-4">
          {/* Milestone Header */}
          <Card className={isDark ? 'bg-gray-800' : 'bg-white'}>
            <CardHeader className="gap-3">
              <View className="flex-row items-center justify-between">
                <CardTitle className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {milestone.title}
                </CardTitle>
                <Checkbox 
                  checked={milestone.status === 'completed'} 
                  onCheckedChange={handleToggleComplete} 
                />
              </View>
              
              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-2">
                  <View 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getPriorityColor(milestone.priority) }}
                  />
                  <Text className={`text-sm capitalize ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {milestone.priority} priority
                  </Text>
                </View>
                
                <View className="flex-row items-center gap-2">
                  <View 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getStatusColor(milestone.status) }}
                  />
                  <Text className={`text-sm capitalize ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {milestone.status.replace('_', ' ')}
                  </Text>
                </View>
              </View>
            </CardHeader>
            
            <CardContent className="gap-3">
              {milestone.description && (
                <Text className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {milestone.description}
                </Text>
              )}
              
              <View className="flex-row items-center gap-2">
                <Ionicons name="calendar-outline" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {milestone.deadline && milestone.deadline 
                    ? `${new Date(milestone.deadline).toLocaleDateString()} - ${new Date(milestone.deadline).toLocaleDateString()}`
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
              {/* {milestone.category && (
                <View className="flex-row items-center gap-2">
                  <Ionicons name="folder-outline" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Category: {milestone?.category}
                  </Text>
                </View>
              )}
              
              {milestone.budget && (
                <View className="flex-row items-center gap-2">
                  <Ionicons name="cash-outline" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Budget: ${milestone.budget}
                  </Text>
                </View>
              )} */}
              
              {milestone.estimatedHours && (
                <View className="flex-row items-center gap-2">
                  <Ionicons name="time-outline" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Estimated Hours: {milestone.estimatedHours}h
                  </Text>
                </View>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <View className="flex-row gap-3 pt-4">
            <Button 
              variant="outline" 
              onPress={() => onEdit?.(milestone)}
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
                {milestone.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
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
