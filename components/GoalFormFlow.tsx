import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Dimensions } from 'react-native';
import { BottomSheet, BottomSheetCloseTrigger, BottomSheetContent, BottomSheetHeader, BottomSheetOpenTrigger, BottomSheetFooter } from '~/components/deprecated-ui/bottom-sheet';
import { Button, buttonTextVariants } from '~/components/ui/button';
import db from '@/db';
import { id, UpdateParams } from '@instantdb/react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedValue } from 'react-native-reanimated';
import * as z from 'zod';
import { useFormFlow } from '@/hooks/useFormFlow';
import GoalFormComponent from './GoalForm';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { CreateGoalSchema, GoalSchema, PrioritySchema, StatusSchema } from '@/lib/validations';
import { cn } from '@/lib/utils';
import { useHandlers } from '@/hooks/data-provider';
import { Description } from '@rn-primitives/alert-dialog';
import { AppSchema } from '@/instant.schema';




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




// ===================================================== Component Start ====================================================

export default function GoalsFlowModal()   {


    const sharedValue = useSharedValue(1);
    const BottomSheetinsets = useSafeAreaInsets();

    const { createGoal } = useHandlers()

    const formFlow = useFormFlow({
        stepSchemas,
        scrollEnabled: false,
        fullSchema,
        defaultValues: {
            priority: 'low',
            startDate: new Date().toISOString(),
            targetEndDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            overallProgress: 0,
            owner: '',
            title: '',
            status: 'not_started'
        },
        onSubmit: async (data) => {
            const goalData = {

                ...data,
                startDate: data.startDate,
                targetEndDate: data.targetEndDate,
                createdAt: new Date().toISOString(),
                description: data.description || '',    
                id: id(),
                overallProgress: 0,
                tags: data.tags || [],
                category: data.category || '',
            };

            createGoal(goalData as Required<UpdateParams<AppSchema, "goals">>)
            // Save to database
            


        },
    });

    const [showMilestonesModal, setShowMilestonesModal] = useState(false);
    // const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const insets = useSafeAreaInsets();

    const contentInsets = {
        top: insets.top,
        bottom: insets.bottom,
        left: 12,
        right: 12,
    };

  

    return (
        <BottomSheet>
            <BottomSheetOpenTrigger asChild>
                <TouchableOpacity className="bg-indigo-500 px-4 py-2 rounded-lg">
                    <Text className="text-white font-semibold">+ Add Goal</Text>
                </TouchableOpacity>
            </BottomSheetOpenTrigger>
            <BottomSheetContent snapPoints={["50%", "80%"]} topInset={BottomSheetinsets.top + 44}>
                <BottomSheetHeader>
                    <Text className="text-foreground text-xl font-bold text-center pb-1">
                        Create New Goal
                    </Text>
                    <BottomSheetCloseTrigger />
                </BottomSheetHeader>
                <BottomSheetScrollView className="gap-5 py-4 px-5 h-[300px]">
                    {/* <View className="pb-2 gap-6"> */}
                        <GoalFormComponent formFlow={formFlow} />
                    {/* </View> */}
                </BottomSheetScrollView>
            

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