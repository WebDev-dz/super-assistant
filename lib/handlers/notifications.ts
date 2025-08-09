import db from '@/db';
import { AppSchema } from '@/instant.schema';
import { UpdateParams } from '@instantdb/react';
import { PartialDeep } from '../types';
import { NotificationSchema } from '../validations';
import Toast from 'react-native-toast-message';

export type NotificationsHandlers = {
    handleCreateNotification: (notification: Required<UpdateParams<AppSchema, "notifications">>) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
    handleUpdateNotification: (notification: UpdateParams<AppSchema, "notifications">) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
    handleDeleteNotification: (notificationId: string) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
    handleDeleteBulkNotifications: (notificationIds: string[]) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
    handleScheduleNotification: (notification: UpdateParams<AppSchema, "notifications">) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
    handleCancelScheduledNotification: (notificationId: string) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
    handleCancelAllScheduledNotifications: () => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
}

const handleCreateNotification = async (notification: Required<UpdateParams<AppSchema, "notifications">>) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Notification Created",
                "text2": `Successfully created: ${notification.title || 'New Notification'}`,
            });
        },
        error: (error: any) => {
            console.error('Error creating notification:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Creating Notification",
                "text2": error?.message || 'Failed to create notification',
            });
        }
    };
}

const handleUpdateNotification = async (notification: UpdateParams<AppSchema, "notifications">) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Notification Updated",
                "text2": `Successfully updated: ${notification.title || 'Notification'}`,
            });
        },
        error: (error: any) => {
            console.error('Error updating notification:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Updating Notification",
                "text2": error?.message || 'Failed to update notification',
            });
        }
    };
}

const handleDeleteNotification = async (notificationId: string) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Notification Deleted",
                "text2": "Notification successfully removed",
            });
        },
        error: (error: any) => {
            console.error('Error deleting notification:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Deleting Notification",
                "text2": error?.message || 'Failed to delete notification',
            });
        }
    };
}

const handleDeleteBulkNotifications = async (notificationIds: string[]) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Notifications Deleted",
                "text2": `Successfully removed ${notificationIds.length} notifications`,
            });
        },
        error: (error: any) => {
            console.error('Error deleting bulk notifications:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Deleting Notifications",
                "text2": error?.message || 'Failed to delete notifications',
            });
        }
    };
}

const handleScheduleNotification = async (notification: UpdateParams<AppSchema, "notifications">) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Notification Scheduled",
                "text2": `Successfully scheduled: ${notification.title || 'Notification'}`,
            });
        },
        error: (error: any) => {
            console.error('Error scheduling notification:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Scheduling Notification",
                "text2": error?.message || 'Failed to schedule notification',
            });
        }
    };
}

const handleCancelScheduledNotification = async (notificationId: string) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Notification Cancelled",
                "text2": "Scheduled notification successfully cancelled",
            });
        },
        error: (error: any) => {
            console.error('Error cancelling scheduled notification:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Cancelling Notification",
                "text2": error?.message || 'Failed to cancel notification',
            });
        }
    };
}

const handleCancelAllScheduledNotifications = async () => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "All Notifications Cancelled",
                "text2": "Successfully cancelled all scheduled notifications",
            });
        },
        error: (error: any) => {
            console.error('Error cancelling all scheduled notifications:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Cancelling Notifications",
                "text2": error?.message || 'Failed to cancel all notifications',
            });
        }
    };
}

export const notificationsHandlers: NotificationsHandlers = {
    handleCreateNotification,
    handleUpdateNotification,
    handleDeleteNotification,
    handleDeleteBulkNotifications,
    handleScheduleNotification,
    handleCancelScheduledNotification,
    handleCancelAllScheduledNotifications
};