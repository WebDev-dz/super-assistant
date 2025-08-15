import React from 'react';
import { View, Alert, StyleSheet } from 'react-native';
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
import { cn, getPriorityColor, getStatusColor } from '@/lib/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFormFlow } from '@/hooks/useFormFlow';
import z from 'zod';
import { GoalSchema, PrioritySchema, StatusSchema } from '@/lib/validations';
import { id, UpdateParams } from '@instantdb/react-native';
import { AppSchema } from '@/instant.schema';
import GoalFormComponent from '../forms/GoalForm';

interface GoalDetailsModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (goal: Goal) => void;
  onCreate?: (goal: Goal) => void;
  mode: 'create' | 'update';
}


// Step-specific schemas
const stepSchemas = [
  z.object({
    title: z.string().min(3, { message: 'Goal title is required.' }),
    description: z.string().optional(),
  }),
  z.object({
    status: StatusSchema,
    priority: PrioritySchema,
    category: z.string().optional(),
  }),
  z.object({
    startDate: z.coerce.string(),
    targetEndDate: z.coerce.string(),
  }),
  z.object({
    budget: z.number().min(0).optional(),
    estimatedTotalHours: z.number().min(0).optional(),
  })
];

// Full schema
const fullSchema = GoalSchema

export default function GoalDetailsModal({ 
  goal, 
  isOpen, 
  onClose, 
  onEdit, 
  onCreate,
  mode 
}: GoalDetailsModalProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { updateGoal, deleteGoal, createGoal } = useHandlers();
  const { ref, open, close } = useBottomSheet();
  const insets = useSafeAreaInsets();

  const defaultValues = mode === 'create' ? {
    priority: 'low',
    title: "",
    startDate: new Date().toISOString(),
    targetEndDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    overallProgress: 0,
    owner: '',
    status: 'not_started',
    description: '',
    tags: [],
    category: ''
  } : {
    ...goal,
    startDate: goal?.startDate || new Date().toISOString(),
    targetEndDate: goal?.targetEndDate || new Date().toISOString()
  };
  const formFlow = useFormFlow({
    stepSchemas,
    scrollEnabled: false,
    fullSchema,
    
    // @ts-ignore
    defaultValues,
    onSubmit: async (data) => {
      try {
        if (mode === 'create') {
          const goalData = {
            ...data,
            id: id(),
            createdAt: new Date().toISOString(),
            overallProgress: 0,
            tags: data.tags || [],
            category: data.category || '',
          };

          const result = await createGoal(goalData as Required<UpdateParams<AppSchema, "goals">>);
          onCreate?.(result);
          onClose();
        } else {
          const goalData = {
            ...data,
            id: goal!.id,
            updatedAt: new Date().toISOString()
          };

          await updateGoal(goalData);
          onEdit?.(goalData);
          onClose();
        }
      } catch (error) {
        Alert.alert(
          'Error',
          mode === 'create' ? 'Failed to create goal' : 'Failed to update goal'
        );
      }
    }



  });
  
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

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
    if (mode !== 'update' || !goal) return;

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

          <GoalFormComponent formFlow={formFlow} />
          {/* Navigation Buttons */}
          <View className={cn("flex-row justify-end gap-4 pt-4 px-10", {})} style={[{ paddingBottom: contentInsets.bottom }]}>
            <View style={styles.navigationButtons}>
              {formFlow.currentStep > 0 && (
                <Button variant="ghost" onPress={formFlow.goToPreviousStep}>
                  <Text className={buttonTextVariants({ variant: "ghost" })}>Previous</Text>
                </Button>
              )}
              {formFlow.currentStep < formFlow.totalSteps - 1 ? (
                <Button onPress={() => {
                  const names = Object.keys(stepSchemas[formFlow.currentStep].shape);
                  formFlow.form.trigger(names);
                  const validation = stepSchemas[formFlow.currentStep].safeParse(formFlow.form.getValues());

                  validation.data ? formFlow.goToNextStep() : Alert.alert('Error', 'Please fill out all required fields.' + validation.error);
                }}>
                  <Text className={buttonTextVariants({ variant: "default" })}>Next</Text>
                </Button>
              ) : (
                <Button onPress={formFlow.onSubmit}>
                  <Text className={buttonTextVariants()}>Submit</Text>
                </Button>
              )}
            </View>

          </View>
        </BottomSheetView>
      </BottomSheetContent>
    </BottomSheet>
  );
}
// ===================================================== Component End ==================================================== 


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagerView: {
    // flex: 1,
    minHeight: 500,
  },
  formSection: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    flexGrow: 1,
    minHeight: 200,
  },
  buttonContainer: {
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});