import db from '@/db';
import { AppSchema } from '@/instant.schema';
import { UpdateParams } from '@instantdb/react';
import z, { object } from 'zod';
import { PartialDeep } from '../types';
import { TaskSchema } from '../validations';
import Toast from 'react-native-toast-message';

export type TasksHandlers = {
    handleCreateTask: (task: Required<UpdateParams<AppSchema, "tasks">>) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
    handleUpdateTask: (task: UpdateParams<AppSchema, "tasks">) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
    handleDeleteTask: (taskId: string) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
    handleDeleteBulkTasks: (taskIds: string[]) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
}

const handleCreateTask = async (task: Required<UpdateParams<AppSchema, "tasks">>) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Task Created",
                "text2": `Successfully created: ${task.title || 'New Task'}`,
            });
        },
        error: (error: any) => {
            console.error('Error creating task:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Creating Task",
                "text2": error?.message || 'Failed to create task',
            });
        }
    };
}

const handleUpdateTask = async (task: UpdateParams<AppSchema, "tasks">) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Task Updated",
                "text2": `Successfully updated: ${task.title || 'Task'}`,
            });
        },
        error: (error: any) => {
            console.error('Error updating task:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Updating Task",
                "text2": error?.message || 'Failed to update task',
            });
        }
    };
}

const handleDeleteTask = async (taskId: string) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Task Deleted",
                "text2": "Task successfully removed",
            });
        },
        error: (error: any) => {
            console.error('Error deleting task:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Deleting Task",
                "text2": error?.message || 'Failed to delete task',
            });
        }
    };
}

const handleDeleteBulkTasks = async (taskIds: string[]) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Tasks Deleted",
                "text2": `Successfully removed ${taskIds.length} tasks`,
            });
        },
        error: (error: any) => {
            console.error('Error deleting bulk tasks:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Deleting Tasks",
                "text2": error?.message || 'Failed to delete tasks',
            });
        }
    };
}

export const tasksHandlers: TasksHandlers = {
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleDeleteBulkTasks
};