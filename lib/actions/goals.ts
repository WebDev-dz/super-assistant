import db from '@/db';
import { AppSchema } from '@/instant.schema';
import { id, UpdateParams } from '@instantdb/react';
import z, { object } from 'zod';
import { PartialDeep } from '../types';
import { GoalSchema } from '../validations';
import { updateQuery } from '../db/queries';
import * as expoCalendar from "expo-calendar"

export type GoalsActions = {
    createGoal: (goal: Required<UpdateParams<AppSchema, "goals">>) => Promise<any>;
    updateGoal: (goal: UpdateParams<AppSchema, "goals">) => Promise<any>;
    deleteGoal: (goalId: string) => Promise<void>;
    deleteBulkGoals: (goalIds: string[]) => Promise<void>;
}

const createGoal = async (goal: Required<UpdateParams<AppSchema, "goals">>) => {
    console.log("Creating Goal:", goal);
    const { success, data, error } = GoalSchema.safeParse(goal);
    if (!success) {
        throw new Error(`Invalid goal data: ${error.message}`);
    }
    const query = await updateQuery("goals", {
        ...data,
        id: id()
    });

    const result = await db.transact(query)

    console.log("Goal created:", result);
    return result;
}



const updateGoal = async (goal: UpdateParams<AppSchema, "goals">) => {
    console.log("Updating Goal:", goal);

    if (!goal.id) {
        throw new Error("Goal ID is required for update");
    }

    const { success, data, error } = GoalSchema.partial().safeParse(goal);
    if (!success) {
        throw new Error(`Invalid goal data: ${error.message}`);
    }



    // Update in database
    const query = await updateQuery("goals", data);
    const result = await db.transact(query);

    console.log("Goal updated:", result);
    return result;
}

const deleteGoal = async (goalId: string) => {
    console.log("Deleting Goal:", goalId);

    if (!goalId) {
        throw new Error("Goal ID is required for deletion");
    }

    try {
        // Delete from expo calendar

        // Delete from database
        const query = await updateQuery("goals", { id: goalId });
        await db.transact([{ ...query, delete: true }]);

        console.log("Goal deleted successfully:", goalId);
    } catch (error) {
        console.error("Error deleting goal:", error);
        throw new Error(`Failed to delete goal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

const deleteBulkGoals = async (goalIds: string[]) => {
    console.log("Bulk deleting Goals:", goalIds);

    if (!goalIds || goalIds.length === 0) {
        throw new Error("Goal IDs array is required and cannot be empty");
    }

    try {

        // Delete from database in batch
        const deleteQueries = await Promise.all(
            goalIds.map(async (id) => {
                const query = await updateQuery("goals", { id });
                return { ...query, delete: true };
            })
        );

        await db.transact(deleteQueries);

        console.log("Bulk delete completed successfully:", goalIds);
    } catch (error) {
        console.error("Error in bulk delete:", error);
        throw new Error(`Failed to bulk delete goals: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export const goalsActions: GoalsActions = {
    createGoal,
    updateGoal,
    deleteGoal,
    deleteBulkGoals
};