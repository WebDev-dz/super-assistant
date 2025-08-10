import db from '@/db';
import { AppSchema } from '@/instant.schema';
import { UpdateParams } from '@instantdb/react';
import * as Notifications from 'expo-notifications';
import { PartialDeep } from '../types';
import { NotificationSchema } from '../validations';
import { deleteQuery, updateQuery } from '../db/queries';
import { SchedulableTriggerInputTypes } from 'expo-notifications';

export type NotificationsActions = {
    createNotification: (notification: Required<UpdateParams<AppSchema, "notifications">>) => Promise<any>;
    updateNotification: (notification: UpdateParams<AppSchema, "notifications">) => Promise<any>;
    deleteNotification: (notificationId: string) => Promise<void>;
    deleteBulkNotifications: (notificationIds: string[]) => Promise<void>;
    scheduleNotification: (notification: UpdateParams<AppSchema, "notifications">) => Promise<string>;
    cancelScheduledNotification: (notificationId: string) => Promise<void>;
    cancelAllScheduledNotifications: () => Promise<void>;
}

const createNotification = async (notification: Required<UpdateParams<AppSchema, "notifications">>) => {
    console.log("Creating Notification:", notification);
    const { success, data, error } = NotificationSchema.safeParse(notification);
    if (!success) {
        throw new Error(`Invalid notification data: ${error.message}`);
    }

    // Create notification in database
    const query = await updateQuery("notifications", data);
    const result = await db.transact(query);

    console.log("Notification created:", result);
    return result;
}

const updateNotification = async (notification: UpdateParams<AppSchema, "notifications">) => {
    console.log("Updating Notification:", notification);
    
    if (!notification.id) {
        throw new Error("Notification ID is required for update");
    }

    const { success, data, error } = NotificationSchema.partial().safeParse(notification);
    if (!success) {
        throw new Error(`Invalid notification data: ${error.message}`);
    }

    // Update in database
    const query = await updateQuery("notifications", data);
    const result = await db.transact(query);

    console.log("Notification updated:", result);
    return result;
}

const deleteNotification = async (notificationId: string) => {
    console.log("Deleting Notification:", notificationId);
    
    if (!notificationId) {
        throw new Error("Notification ID is required for deletion");
    }

    try {
        // Cancel scheduled notification if it exists
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        
        // Delete from database
        const query = await updateQuery("notifications", { id: notificationId });
        await db.transact([{ ...query, delete: true }]);
        
        console.log("Notification deleted successfully:", notificationId);
    } catch (error) {
        console.error("Error deleting notification:", error);
        throw new Error(`Failed to delete notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

const deleteBulkNotifications = async (notificationIds: string[]) => {
    console.log("Bulk deleting Notifications:", notificationIds);
    
    if (!notificationIds || notificationIds.length === 0) {
        return;
    }

    try {
        // Cancel scheduled notifications in parallel
        const cancelPromises = notificationIds.map(id => 
            Notifications.cancelScheduledNotificationAsync(id).catch(err => 
                console.warn(`Failed to cancel notification ${id}:`, err)
            )
        );
        await Promise.allSettled(cancelPromises);
        
        // Delete from database in batch
        const deleteQueries = await Promise.all(
            notificationIds.map(async (id) => {
                const query = await updateQuery("notifications", { id });
                return { ...query, delete: true };
            })
        );
        
        await db.transact(deleteQueries);
        
        console.log("Bulk delete completed successfully:", notificationIds);
    } catch (error) {
        console.error("Error in bulk delete:", error);
        throw new Error(`Failed to bulk delete notifications: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

const scheduleNotification = async (notification: UpdateParams<AppSchema, "notifications">) => {
    console.log("Scheduling Notification:", notification);
    
    const { success, data, error } = NotificationSchema.safeParse(notification);
    if (!success) {
        throw new Error(`Invalid notification data: ${error.message}`);
    }

    if (!data.scheduledFor) {
        throw new Error("Scheduled date is required for scheduling notification");
    }

    try {
        const scheduledNotificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: data.title || 'Notification',
                body: data.message || '',
                data: { 
                    notificationId: data.id,
                    ...data 
                },
            },
            trigger: {
                date: new Date(data?.scheduledFor),
                type: SchedulableTriggerInputTypes.DATE,
            },
        });

        // Update notification with scheduled ID
        const updateData = {
            ...data,
            scheduledNotificationId,
            status: 'scheduled' as const,
        };

        const query = await updateQuery("notifications", updateData);
        const result = await db.transact(query);

        console.log("Notification scheduled:", scheduledNotificationId);
        return scheduledNotificationId;
    } catch (error) {
        console.error("Error scheduling notification:", error);
        throw new Error(`Failed to schedule notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

const cancelScheduledNotification = async (notificationId: string) => {
    console.log("Canceling Scheduled Notification:", notificationId);
    
    if (!notificationId) {
        throw new Error("Notification ID is required");
    }

    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        
        // Update notification status in database
        const query = await deleteQuery("notifications", notificationId); 
        await db.transact(query);
        
        console.log("Scheduled notification cancelled:", notificationId);
    } catch (error) {
        console.error("Error canceling scheduled notification:", error);
        throw new Error(`Failed to cancel scheduled notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

const cancelAllScheduledNotifications = async () => {
    console.log("Canceling All Scheduled Notifications");
    
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        
        // Update all scheduled notifications status in database
        // const query = await updateQuery("notifications", { 
        //     status: 'cancelled' as const 
        // });
        // await db.transact(query);
        
        console.log("All scheduled notifications cancelled");
    } catch (error) {
        console.error("Error canceling all scheduled notifications:", error);
        throw new Error(`Failed to cancel all scheduled notifications: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export const notificationsActions: NotificationsActions = {
    createNotification,
    updateNotification,
    deleteNotification,
    deleteBulkNotifications,
    scheduleNotification,
    cancelScheduledNotification,
    cancelAllScheduledNotifications
};