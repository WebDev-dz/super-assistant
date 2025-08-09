import db from '@/db';
import { AppSchema } from '@/instant.schema';
import { UpdateParams } from '@instantdb/react';
import z, { object } from 'zod';
import { PartialDeep } from '../types';
import { GoalSchema } from '../validations';
import Toast from 'react-native-toast-message';

export type GoalsHandlers = {
    handleCreateGoal: (goal: Required<UpdateParams<AppSchema, "goals">>) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
    handleUpdateGoal: (goal: UpdateParams<AppSchema, "goals">) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
    handleDeleteGoal: (goalId: string) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
    handleDeleteBulkGoals: (goalIds: string[]) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
}

const handleCreateGoal = async (goal: Required<UpdateParams<AppSchema, "goals">>) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Goal Created",
                "text2": `Successfully created: ${goal.title || 'New Goal'}`,
            });
        },
        error: (error: any) => {
            console.error('Error creating goal:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Creating Goal",
                "text2": error?.message || 'Failed to create goal',
            });
        }
    };
}

const handleUpdateGoal = async (goal: UpdateParams<AppSchema, "goals">) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Goal Updated",
                "text2": `Successfully updated: ${goal.title || 'Goal'}`,
            });
        },
        error: (error: any) => {
            console.error('Error updating goal:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Updating Goal",
                "text2": error?.message || 'Failed to update goal',
            });
        }
    };
}

const handleDeleteGoal = async (goalId: string) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Goal Deleted",
                "text2": "Goal successfully removed",
            });
        },
        error: (error: any) => {
            console.error('Error deleting goal:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Deleting Goal",
                "text2": error?.message || 'Failed to delete goal',
            });
        }
    };
}

const handleDeleteBulkGoals = async (goalIds: string[]) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Goals Deleted",
                "text2": `Successfully removed ${goalIds.length} goals`,
            });
        },
        error: (error: any) => {
            console.error('Error deleting bulk goals:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Deleting Goals",
                "text2": error?.message || 'Failed to delete goals',
            });
        }
    };
}

export const goalsHandlers: GoalsHandlers = {
    handleCreateGoal,
    handleUpdateGoal,
    handleDeleteGoal,
    handleDeleteBulkGoals
};