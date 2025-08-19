import db from "@/db";
import { AppSchema } from "@/instant.schema";
import { id, UpdateParams } from "@instantdb/react";
import z, { object } from "zod";
import { PartialDeep } from "../types";
// import { CreateTaskSchema, TaskSchema } from "../validations";
import { updateQuery } from "../db/queries";
import * as expoCalendar from "expo-calendar";
import { eventsActions } from "./events";
import { Availability } from "expo-calendar";
import { CreateTaskSchema, TaskSchema } from "../validations";



export type TasksActions = {
  createTask: (
    task: z.infer<typeof CreateTaskSchema>
  ) => Promise<any>;
  updateTask: (task: UpdateParams<AppSchema, "tasks">) => Promise<any>;
  deleteTask: (taskId: string) => Promise<void>;
  deleteBulkTasks: (taskIds: string[]) => Promise<void>;
};

// Helper function to get or create a default calendar
const getDefaultCalendar = async (): Promise<string> => {
  const calendars = await expoCalendar.getCalendarsAsync(expoCalendar.EntityTypes.EVENT);

  // Try to find an existing writable calendar
  const writableCalendar = calendars.find(
    (cal) => cal.allowsModifications && cal.source.name !== "iCloud"
  );

  if (writableCalendar) {
    return writableCalendar.id;
  }

  // If no writable calendar found, create a new one
  const defaultSource = calendars.find((cal) =>
    cal.source.name === "Default" || cal.source.isLocalAccount
  )?.source;

  if (defaultSource) {
    const newCalendarId = await expoCalendar.createCalendarAsync({
      title: "Tasks Calendar",
      color: "#007AFF",
      entityType: expoCalendar.EntityTypes.EVENT,
      sourceId: defaultSource.id,
      source: defaultSource,
      name: "Tasks Calendar",
      ownerAccount: "personal",
      accessLevel: expoCalendar.CalendarAccessLevel.OWNER,
    });
    return newCalendarId;
  }

  throw new Error("No suitable calendar source found");
};

// Helper function to create calendar event with alarms
const createCalendarEventWithAlarms = async (
  task: z.infer<typeof CreateTaskSchema>,
  taskId: string
): Promise<string | null> => {
  if (!task.hasAlarm || !task.alarm || task.alarm.length === 0) {
    return null;
  }

  try {
    // Request calendar permissions
    const { status } = await expoCalendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      console.warn("Calendar permissions not granted");
      return null;
    }

    const calendarId = await getDefaultCalendar();

    // Prepare alarms for expo-calendar
    const alarms = task.alarm.map((alarm) => {
      if (alarm.relativeOffset !== null && alarm.relativeOffset !== undefined) {
        return {
          relativeOffset: alarm.relativeOffset,
          method: alarm.method === "alarm" ?
            expoCalendar.AlarmMethod.ALARM :
            expoCalendar.AlarmMethod.ALERT,
        };
      } else if (alarm.absoluteDate) {
        return {
          absoluteDate: new Date(alarm.absoluteDate),
          method: alarm.method === "alarm" ?
            expoCalendar.AlarmMethod.ALARM :
            expoCalendar.AlarmMethod.ALERT,
        };
      }
      return null;
    }).filter(Boolean);

    // Create the calendar event
    const eventDetails: expoCalendar.Event = {
      id: id(),
      title: task.title,

      notes: task.description || "",
      startDate: task.dueDate ? new Date(task.dueDate) : new Date(),
      endDate: task.dueDate ?
        new Date(new Date(task.dueDate).getTime() + (task.estimatedHours || 1) * 60 * 60 * 1000) :
        new Date(Date.now() + 60 * 60 * 1000), // Default 1 hour duration
      allDay: false,
      alarms: alarms.filter((a) => a !== null) as expoCalendar.Alarm[],
      calendarId,
      location: null,
      timeZone: "UTC+01:00",
      recurrenceRule: null,
      availability: Availability.NOT_SUPPORTED,
      status: expoCalendar.EventStatus.NONE
    };

    const eventId = await expoCalendar.createEventAsync(calendarId, eventDetails);
    console.log("Calendar event created:", eventId);

    return eventId;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return null;
  }
};

// Helper function to update calendar event
const updateCalendarEvent = async (
  task: UpdateParams<AppSchema, "tasks">,
  existingCalendarEventId?: string
): Promise<string | null> => {
  try {
    // Request calendar permissions
    const { status } = await expoCalendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      console.warn("Calendar permissions not granted");
      return existingCalendarEventId || null;
    }

    // If there's an existing event, delete it first
    if (existingCalendarEventId) {
      try {
        await expoCalendar.deleteEventAsync(existingCalendarEventId);
      } catch (error) {
        console.warn("Could not delete existing calendar event:", error);
      }
    }

    // Create new event if task has alarms
    if (task.hasAlarm && task.alarm && task.alarm.length > 0) {
      const calendarId = await getDefaultCalendar();

      const alarms = task.alarm.map((alarm) => {
        if (alarm.relativeOffset !== null && alarm.relativeOffset !== undefined) {
          return {
            relativeOffset: alarm.relativeOffset,
            method: alarm.method === "alarm" ?
              expoCalendar.AlarmMethod.ALARM :
              expoCalendar.AlarmMethod.ALERT,
          };
        } else if (alarm.absoluteDate) {
          return {
            absoluteDate: new Date(alarm.absoluteDate),
            method: alarm.method === "alarm" ?
              expoCalendar.AlarmMethod.ALARM :
              expoCalendar.AlarmMethod.ALERT,
          };
        }
        return null;
      }).filter(Boolean);

      const eventDetails: expoCalendar.Event = {
        title: task.title || "Task",
        notes: task.description || undefined,
        startDate: task.dueDate ? new Date(task.dueDate) : new Date(),
        endDate: task.dueDate ?
          new Date(new Date(task.dueDate).getTime() + (task.estimatedHours || 1) * 60 * 60 * 1000) :
          new Date(Date.now() + 60 * 60 * 1000),
        allDay: false,
        alarms: alarms,
      };

      const eventId = await expoCalendar.createEventAsync(calendarId, eventDetails);
      console.log("Calendar event updated:", eventId);
      return eventId;
    }

    return null;
  } catch (error) {
    console.error("Error updating calendar event:", error);
    return null;
  }
};

const createTask = async (task: z.infer<typeof CreateTaskSchema>) => {
  console.log("Creating Task:", task);
  const { success, data, error } = CreateTaskSchema.safeParse({ ...task, completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  if (!success) {
    throw new Error(`Invalid task data: ${error.message}`);
  }

  const taskId = id();

  // Create calendar event with alarms first
  let calendarEventId: string | null = null;
  if (data.hasAlarm && data.alarm && data.alarm.length > 0) {
    calendarEventId = await createCalendarEventWithAlarms(data, taskId);
  }

  // Create task in database with calendar event ID
  const query = await updateQuery("tasks", {
    ...data,
    dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: taskId,
    completed: task.completed || false,
    // calendarEventId: calendarEventId,
  });

  const result = await db.transact(query);
  console.log("Task created:", result);
  return result;
};

const updateTask = async (task: UpdateParams<AppSchema, "tasks">) => {
  console.log("Updating Task:", task);

  if (!task.id) {
    throw new Error("Task ID is required for update");
  }

  const { success, data, error } = TaskSchema.partial().safeParse(task);
  if (!success) {
    throw new Error(`Invalid task data: ${error.message}`);
  }


  

  // Update task in database
  const query = await updateQuery("tasks", {
    ...data,
    dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
    updatedAt: new Date().toISOString(),
    id: task.id,
  });

  const result = await db.transact(query);
  console.log("Task updated:", result);
  return result;
};

const deleteTask = async (taskId: string) => {
  console.log("Deleting Task:", taskId);

  if (!taskId) {
    throw new Error("Task ID is required for deletion");
  }

  try {
    // Get task to find calendar event ID
    const existingTasks = await db.useQuery({ tasks: { $: { where: { id: taskId } } } });
    const existingTask = existingTasks.data?.tasks?.[0];

    // Delete from expo calendar first
    if (existingTask?.calendarEventId) {
      try {
        const { status } = await expoCalendar.requestCalendarPermissionsAsync();
        if (status === "granted") {
          await expoCalendar.deleteEventAsync(existingTask.calendarEventId);
          console.log("Calendar event deleted:", existingTask.calendarEventId);
        }
      } catch (error) {
        console.warn("Could not delete calendar event:", error);
      }
    }

    // Delete from database
    const query = await updateQuery("tasks", { id: taskId });
    await db.transact([{ ...query, delete: true }]);

    console.log("Task deleted successfully:", taskId);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error(
      `Failed to delete task: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

const deleteBulkTasks = async (taskIds: string[]) => {
  console.log("Bulk deleting Tasks:", taskIds);

  if (!taskIds || taskIds.length === 0) {
    return;
  }

  try {
    // Get tasks to find calendar event IDs
    const existingTasks = await db.useQuery({
      tasks: { $: { where: { id: { in: taskIds } } } }
    });

    // Delete calendar events
    const { status } = await expoCalendar.requestCalendarPermissionsAsync();
    if (status === "granted" && existingTasks.data?.tasks) {
      await Promise.all(
        existingTasks.data.tasks.map(async (task) => {
          if (task.calendarEventId) {
            try {
              await expoCalendar.deleteEventAsync(task.calendarEventId);
            } catch (error) {
              console.warn(`Could not delete calendar event ${task.calendarEventId}:`, error);
            }
          }
        })
      );
    }

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
    throw new Error(
      `Failed to bulk delete tasks: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

export const tasksActions: TasksActions = {
  createTask,
  updateTask,
  deleteTask,
  deleteBulkTasks,
};