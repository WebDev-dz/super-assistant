import db from '@/db';
import { AppSchema } from '@/instant.schema';
import { UpdateParams } from '@instantdb/react';
import z, { object } from 'zod';
import { PartialDeep } from '../types';
import { TaskSchema } from '../validations';
import { updateQuery } from '../db/queries';
import * as expoCalendar from "expo-calendar"

export type TasksActions = {
    createTask: (task: Required<UpdateParams<AppSchema, "tasks">>) => Promise<any>;
    updateTask: (task: UpdateParams<AppSchema, "tasks">) => Promise<any>;
    deleteTask: (taskId: string) => Promise<void>;
    deleteBulkTasks: (taskIds: string[]) => Promise<void>;
}

const createTask = async (task: Required<UpdateParams<AppSchema, "tasks">>) => {
    console.log("Creating Task:", task);
    const { success, data, error } = TaskSchema.safeParse(task);
    if (!success) {
        throw new Error(`Invalid task data: ${error.message}`);
    }

   
    
    const query = await updateQuery("tasks", data);

    const result = await db.transact(query)

    console.log("Task created:", result);
    return result;
}



const updateTask = async (task: UpdateParams<AppSchema, "tasks">) => {
    console.log("Updating Task:", task);
    
    if (!task.id) {
        throw new Error("Task ID is required for update");
    }

    const { success, data, error } = TaskSchema.partial().safeParse(task);
    if (!success) {
        throw new Error(`Invalid task data: ${error.message}`);
    }

    

    // Update in database
    const query = await updateQuery("tasks", data);
    const result = await db.transact(query);

    console.log("Task updated:", result);
    return result;
}

const deleteTask = async (taskId: string) => {
    console.log("Deleting Task:", taskId);
    
    if (!taskId) {
        throw new Error("Task ID is required for deletion");
    }

    try {
        // Delete from expo calendar
        
        // Delete from database
        const query = await updateQuery("tasks", { id: taskId });
        await db.transact([{ ...query, delete: true }]);
        
        console.log("Task deleted successfully:", taskId);
    } catch (error) {
        console.error("Error deleting task:", error);
        throw new Error(`Failed to delete task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

const deleteBulkTasks = async (taskIds: string[]) => {
    console.log("Bulk deleting Tasks:", taskIds);
    
    if (!taskIds || taskIds.length === 0) {
        return;
    }

    try {
        
        // Delete from database in batch
        const deleteQueries = await Promise.all(
            taskIds.map(async (id) => {
                const query = await updateQuery("tasks", { id });
                return { ...query, delete: true };
            })
        );
        
        await db.transact(deleteQueries);
        
        console.log("Bulk delete completed successfully:", taskIds);
    } catch (error) {
        console.error("Error in bulk delete:", error);
        throw new Error(`Failed to bulk delete tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export const tasksActions: TasksActions = {
    createTask,
    updateTask,
    deleteTask,
    deleteBulkTasks
};