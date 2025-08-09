import db from '@/db';
import { AppSchema } from '@/instant.schema';
import { UpdateParams } from '@instantdb/react';
import z, { object } from 'zod';
import { PartialDeep } from '../types';
import { CalendarEventSchema } from '../validations';
import * as expoCalendar from "expo-calendar";
import Toast from 'react-native-toast-message';

export type EventsHandlers = {
    handleCreateEvent: (event: Required<UpdateParams<AppSchema, "calendarEvents">>) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
    handleUpdateEvent: (event: UpdateParams<AppSchema, "calendarEvents">) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
    handleDeleteEvent: (eventId: string) => Promise<{
        success: () => void;
        error: (error: any) => void;}>;
    handleDeleteBulkEvents: (eventIds: string[]) => Promise<{
        success: () => void;
        error: (error: any) => void;}>;
}

const handleCreateEvent = async (event: Required<UpdateParams<AppSchema, "calendarEvents">>) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Event Created",
                "text2": `Successfully created: ${event.title}`,
            });

            // Optionally sync with device calendar
        },
        error: (error: any) => {
            console.error('Error creating event:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Creating Event",
                "text2": error?.message || 'Failed to create event',
            });
        }
    };
}

const handleUpdateEvent = async (event: UpdateParams<AppSchema, "calendarEvents">) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Event Updated",
                "text2": `Successfully updated: ${event.title || 'Event'}`,
            });
        },
        error: (error: any) => {
            console.error('Error updating event:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Updating Event",
                "text2": error?.message || 'Failed to update event',
            });
        }
    };
}

const handleDeleteEvent = async (eventId: string) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Event Deleted",
                "text2": "Event successfully removed",
            });
        },
        error: (error: any) => {
            console.error('Error deleting event:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Deleting Event",
                "text2": error?.message || 'Failed to delete event',
            });
        }
    };
}

const handleDeleteBulkEvents = async (eventIds: string[]) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Events Deleted",
                "text2": `Successfully removed ${eventIds.length} events`,
            });
        },
        error: (error: any) => {
            console.error('Error deleting bulk events:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Deleting Events",
                "text2": error?.message || 'Failed to delete events',
            });
        }
    };
}



export const eventsHandlers: EventsHandlers = {
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    handleDeleteBulkEvents
};