import db from '@/db';
import { AppSchema } from '@/instant.schema';
import { UpdateParams } from '@instantdb/react';
import z, { object } from 'zod';
import { PartialDeep } from '../types';
import { MilestoneSchema } from '../validations';
import { updateQuery } from '../db/queries';
import * as expoCalendar from "expo-calendar"

export type MilestonesActions = {
    createMilestone: (milestone: Required<UpdateParams<AppSchema, "milestones">>) => Promise<any>;
    updateMilestone: (milestone: UpdateParams<AppSchema, "milestones">) => Promise<any>;
    deleteMilestone: (milestoneId: string) => Promise<void>;
    deleteBulkMilestones: (milestoneIds: string[]) => Promise<void>;
}

const createMilestone = async (milestone: Required<UpdateParams<AppSchema, "milestones">>) => {
    console.log("Creating Milestone:", milestone);
    const { success, data, error } = MilestoneSchema.safeParse(milestone);
    if (!success) {
        throw new Error(`Invalid milestone data: ${error.message}`);
    }

   
    
    const query = await updateQuery("milestones", data);

    const result = await db.transact(query)

    console.log("Milestone created:", result);
    return result;
}



const updateMilestone = async (milestone: UpdateParams<AppSchema, "milestones">) => {
    console.log("Updating Milestone:", milestone);
    
    if (!milestone.id) {
        throw new Error("Milestone ID is required for update");
    }

    const { success, data, error } = MilestoneSchema.partial().safeParse(milestone);
    if (!success) {
        throw new Error(`Invalid milestone data: ${error.message}`);
    }

    

    // Update in database
    const query = await updateQuery("milestones", data);
    const result = await db.transact(query);

    console.log("Milestone updated:", result);
    return result;
}

const deleteMilestone = async (milestoneId: string) => {
    console.log("Deleting Milestone:", milestoneId);
    
    if (!milestoneId) {
        throw new Error("Milestone ID is required for deletion");
    }

    try {
        // Delete from expo calendar
        
        // Delete from database
        const query = await updateQuery("milestones", { id: milestoneId });
        await db.transact([{ ...query, delete: true }]);
        
        console.log("Milestone deleted successfully:", milestoneId);
    } catch (error) {
        console.error("Error deleting milestone:", error);
        throw new Error(`Failed to delete milestone: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

const deleteBulkMilestones = async (milestoneIds: string[]) => {
    console.log("Bulk deleting Milestones:", milestoneIds);
    
    if (!milestoneIds || milestoneIds.length === 0) {
        return;
    }

    try {
        
        // Delete from database in batch
        const deleteQueries = await Promise.all(
            milestoneIds.map(async (id) => {
                const query = await updateQuery("milestones", { id });
                return { ...query, delete: true };
            })
        );
        
        await db.transact(deleteQueries);
        
        console.log("Bulk delete completed successfully:", milestoneIds);
    } catch (error) {
        console.error("Error in bulk delete:", error);
        throw new Error(`Failed to bulk delete milestones: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export const milestonesActions: MilestonesActions = {
    createMilestone,
    updateMilestone,
    deleteMilestone,
    deleteBulkMilestones
};