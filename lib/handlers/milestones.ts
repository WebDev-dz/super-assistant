import db from '@/db';
import { AppSchema } from '@/instant.schema';
import { UpdateParams } from '@instantdb/react';
import z, { object } from 'zod';
import { PartialDeep } from '../types';
import { MilestoneSchema } from '../validations';
import Toast from 'react-native-toast-message';

export type MilestonesHandlers = {
    handleCreateMilestone: (milestone: Required<UpdateParams<AppSchema, "milestones">>) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
    handleUpdateMilestone: (milestone: UpdateParams<AppSchema, "milestones">) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
    handleDeleteMilestone: (milestoneId: string) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
    handleDeleteBulkMilestones: (milestoneIds: string[]) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
}

const handleCreateMilestone = async (milestone: Required<UpdateParams<AppSchema, "milestones">>) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Milestone Created",
                "text2": `Successfully created: ${milestone.title || 'New Milestone'}`,
            });
        },
        error: (error: any) => {
            console.error('Error creating milestone:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Creating Milestone",
                "text2": error?.message || 'Failed to create milestone',
            });
        }
    };
}

const handleUpdateMilestone = async (milestone: UpdateParams<AppSchema, "milestones">) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Milestone Updated",
                "text2": `Successfully updated: ${milestone.title || 'Milestone'}`,
            });
        },
        error: (error: any) => {
            console.error('Error updating milestone:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Updating Milestone",
                "text2": error?.message || 'Failed to update milestone',
            });
        }
    };
}

const handleDeleteMilestone = async (milestoneId: string) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Milestone Deleted",
                "text2": "Milestone successfully removed",
            });
        },
        error: (error: any) => {
            console.error('Error deleting milestone:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Deleting Milestone",
                "text2": error?.message || 'Failed to delete milestone',
            });
        }
    };
}

const handleDeleteBulkMilestones = async (milestoneIds: string[]) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Milestones Deleted",
                "text2": `Successfully removed ${milestoneIds.length} milestones`,
            });
        },
        error: (error: any) => {
            console.error('Error deleting bulk milestones:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Deleting Milestones",
                "text2": error?.message || 'Failed to delete milestones',
            });
        }
    };
}

export const milestonesHandlers: MilestonesHandlers = {
    handleCreateMilestone,
    handleUpdateMilestone,
    handleDeleteMilestone,
    handleDeleteBulkMilestones
};