import db from '@/db';
import { AppSchema } from '@/instant.schema';
import { UpdateParams } from '@instantdb/react';
import z, { object } from 'zod';
import { PartialDeep } from '../types';
import { CalendarEventSchema } from '../validations';
import { updateQuery } from '../db/queries';
import * as expoCalendar from "expo-calendar"

export type EventsActions = {
    createEvent: (event: Required<UpdateParams<AppSchema, "calendarEvents">>) => Promise<any>;
    updateEvent: (event: UpdateParams<AppSchema, "calendarEvents">) => Promise<any>;
    deleteEvent: (eventId: string) => Promise<void>;
    deleteBulkEvents: (eventIds: string[]) => Promise<void>;
}

const createEvent = async (event: Required<UpdateParams<AppSchema, "calendarEvents">>) => {
    console.log("Creating Event:", event);
    const { success, data, error } = CalendarEventSchema.safeParse(event);
    if (!success) {
        throw new Error(`Invalid event data: ${error.message}`);
    }

    const response = await expoCalendar.createEventAsync(event.calendarId, {
        ...data,
        startDate: new Date(data.startDate),
        
        endDate: new Date(data.endDate),
    })
    
    const query = await updateQuery("calendarEvents", {
        ...data,
        id: response,
    });

    const result = await db.transact(query)

    console.log("Event created:", result);
    return result;
}

const updateEvent = async (event: UpdateParams<AppSchema, "calendarEvents">) => {
    console.log("Updating Event:", event);
    
    if (!event.id) {
        throw new Error("Event ID is required for update");
    }

    const { success, data, error } = CalendarEventSchema.partial().safeParse(event);
    if (!success) {
        throw new Error(`Invalid event data: ${error.message}`);
    }

    // Update in expo calendar if needed
    if (data.calendarId) {
        const updateData: any = { ...data };
        
        if (data.startDate) {
            updateData.startDate = new Date(data.startDate);
        }
        if (data.endDate) {
            updateData.endDate = new Date(data.endDate);
        }

        await expoCalendar.updateEventAsync(event.id, updateData);
    }

    // Update in database
    const query = await updateQuery("calendarEvents", data);
    const result = await db.transact(query);

    console.log("Event updated:", result);
    return result;
}

const deleteEvent = async (eventId: string) => {
    console.log("Deleting Event:", eventId);
    
    if (!eventId) {
        throw new Error("Event ID is required for deletion");
    }

    try {
        // Delete from expo calendar
        await expoCalendar.deleteEventAsync(eventId);
        
        // Delete from database
        const query = await updateQuery("calendarEvents", { id: eventId });
        await db.transact([{ ...query, delete: true }]);
        
        console.log("Event deleted successfully:", eventId);
    } catch (error) {
        console.error("Error deleting event:", error);
        throw new Error(`Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

const deleteBulkEvents = async (eventIds: string[]) => {
    console.log("Bulk deleting Events:", eventIds);
    
    if (!eventIds || eventIds.length === 0) {
        return;
    }

    try {
        // Delete from expo calendar in parallel
        const expoDeletePromises = eventIds.map(id => expoCalendar.deleteEventAsync(id));
        await Promise.allSettled(expoDeletePromises);
        
        // Delete from database in batch
        const deleteQueries = await Promise.all(
            eventIds.map(async (id) => {
                const query = await updateQuery("calendarEvents", { id });
                return { ...query, delete: true };
            })
        );
        
        await db.transact(deleteQueries);
        
        console.log("Bulk delete completed successfully:", eventIds);
    } catch (error) {
        console.error("Error in bulk delete:", error);
        throw new Error(`Failed to bulk delete events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export const eventsActions: EventsActions = {
    createEvent,
    updateEvent,
    deleteEvent,
    deleteBulkEvents
};