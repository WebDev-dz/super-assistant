// lib/validations.ts
import { z } from "zod";
import * as expoCalendar from "expo-calendar";

// Enum schemas for consistent validation
export const StatusSchema = z.enum([
  "not_started",
  "in_progress",
  "on_hold",
  "completed",
  "cancelled",
]).describe("Current status of a goal, milestone, or task");

export const PrioritySchema = z.enum(["low", "medium", "high", "urgent"])
  .describe("Priority level indicating importance and urgency");

const NotificationTypeSchema = z.enum([
  "milestone_due",
  "goal_overdue",
  "task_assigned",
  "progress_update",
]).describe("Type of notification to be sent to users");

const EventTypeSchema = z.enum(["goal", "milestone", "task", "reminder"])
  .describe("Type of calendar event being created");

// User entity schema
export const UserSchema = z.object({
  id: z.string().describe("Unique identifier for the user"),
  email: z.email().optional().nullable().describe("User's email address for authentication and notifications"),
  name: z.string().optional().nullable().describe("Display name of the user"),
});

// Goals entity schema
export const GoalSchema = z.object({
  id: z.string().describe("Unique identifier for the goal"),
  title: z.string().min(3, { message: "Goal title is required." })
    .describe("Clear, descriptive title for the goal"),
  description: z.string().nullish()
    .describe("Detailed description explaining the goal's purpose and scope"),
  status: StatusSchema.describe("Current progress status of the goal"),
  priority: PrioritySchema.describe("Priority level for resource allocation and focus"),
  category: z.string().nullish()
    .describe("Category or domain this goal belongs to (e.g., 'Health', 'Career', 'Personal')"),
  tags: z.array(z.string()).nullish()
    .describe("Array of tags for organizing and filtering goals"),

  // Dates
  startDate: z.string().describe("When work on this goal begins (ISO date string)"),
  targetEndDate: z.string().describe("Planned completion date for the goal (ISO date string)"),
  actualEndDate: z.string().nullish()
    .describe("Actual completion date when goal is finished (ISO date string)"),
  createdAt: z.string().describe("Timestamp when the goal was created (ISO date string)"),
  updatedAt: z.string().nullish()
    .describe("Timestamp when the goal was last modified (ISO date string)"),

  // Progress tracking
  overallProgress: z.number().min(0).max(100)
    .describe("Overall completion percentage calculated from milestone progress"),

  owner: z.string().describe("User ID of the person responsible for this goal"),

  // Resources
  budget: z.number().min(0).nullish()
    .describe("Budget allocated for achieving this goal (in currency units)"),
  estimatedTotalHours: z.number().min(0).nullish()
    .describe("Estimated total time required to complete the goal"),
  actualTotalHours: z.number().min(0).nullish()
    .describe("Actual time spent on the goal (updated from task time tracking)"),

  // Calendar integration
  calendarId: z.string().nullish()
    .describe("ID of the calendar where goal events are stored"),
}).strict();

// Milestones entity schema
export const MilestoneSchema = z.object({
  id: z.string().describe("Unique identifier for the milestone"),
  goalId: z.string().describe("ID of the parent goal this milestone belongs to"),
  title: z.string().describe("Clear, specific title describing what this milestone achieves"),
  description: z.string().optional().nullable()
    .describe("Detailed description of milestone deliverables and acceptance criteria"),
  percentage: z.coerce.number().min(0).max(100)
    .describe("How much of the overall goal this milestone represents"),
  completed: z.boolean().describe("Whether this milestone has been completed"),
  status: StatusSchema.describe("Current progress status of the milestone"),
  priority: PrioritySchema.describe("Priority level relative to other milestones"),

  // Dates
  deadline: z.coerce.string().describe("Target completion date for this milestone (ISO date string)"),
  createdAt: z.coerce.string().describe("Timestamp when the milestone was created (ISO date string)"),
  updatedAt: z.coerce.string().optional().nullable()
    .describe("Timestamp when the milestone was last modified (ISO date string)"),

  // Dependencies
  dependsOn: z.array(z.string()).optional().nullable()
    .describe("Array of milestone IDs that must be completed before this one can start"),

  // Time tracking
  estimatedHours: z.coerce.number().min(0).optional().nullable()
    .describe("Estimated time required to complete this milestone"),
  actualHours: z.coerce.number().min(0).optional().nullable()
    .describe("Actual time spent on this milestone (sum of related task hours)"),

  // Calendar integration
  calendarEventId: z.string().optional().nullable()
    .describe("ID of the associated calendar event for deadline tracking"),
  reminders: z
    .array(
      z.object({
        type: z.string().describe("Type of reminder (e.g., 'email', 'push', 'calendar')"),
        time: z.coerce.number().describe("Minutes before deadline to send reminder"),
        message: z.string().optional().nullable()
          .describe("Custom message for the reminder notification"),
      })
    )
    .optional().nullable()
    .describe("Array of reminder configurations for this milestone"),
});

export const AlarmSchema = z.object({
  relativeOffset: z.number().optional().nullable()
    .describe("Minutes before event to trigger alarm (negative for before, positive for after)"),
  absoluteDate: z.coerce.string().optional().nullable()
    .describe("Specific date and time to trigger alarm (ISO date string)"),
  method: z.enum(["alert", "alarm"]).optional().nullable()
    .describe("How the alarm should be presented to the user"),
  structuredLocation: z.object({
    title: z.string().optional().nullable().describe("Human-readable location name"),
    proximity: z.string().optional().nullable()
      .describe("When to trigger based on location (e.g., 'enter', 'leave')"),
    radius: z.number().optional().nullable()
      .describe("Radius in meters for location-based triggers"),
    coords: z
      .object({
        latitude: z.number().optional().nullable().describe("Latitude coordinate for location"),
        longitude: z.number().optional().nullable().describe("Longitude coordinate for location"),
      })
      .optional().nullable()
      .describe("GPS coordinates for location-based alarms"),
  }).describe("Location-based alarm configuration"),
});

// Tasks entity schema
export const TaskSchema = z.object({
  id: z.string().describe("Unique identifier for the task"),
  milestoneId: z.string().describe("ID of the parent milestone this task belongs to"),
  title: z.string().describe("Clear, actionable title describing what needs to be done"),
  description: z.string().optional().nullable().refine((val) => val !== null)
    .describe("Detailed description of the task including specific steps or requirements"),
  completed: z.boolean().describe("Whether this task has been completed"),
  priority: PrioritySchema.describe("Priority level for task scheduling and focus"),

  // Dates
  dueDate: z.coerce.string().optional().nullable()
    .describe("When this task should be completed"),
  createdAt: z.coerce.string().describe("Timestamp when the task was created"),
  updatedAt: z.coerce.string().optional().nullable()
    .describe("Timestamp when the task was last modified"),

  // Time tracking
  estimatedHours: z.coerce.number().min(0).optional().nullable()
    .describe("Estimated time required to complete this task"),
  actualHours: z.coerce.number().min(0).optional().nullable()
    .describe("Actual time spent working on this task"),

  // Organization
  tags: z.array(z.string()).optional().nullable()
    .describe("Array of tags for organizing and filtering tasks"),
});

// Reminders entity schema
export const ReminderSchema = z.object({
  id: z.string().describe("Unique identifier for the reminder"),
  taskId: z.string().describe("ID of the task this reminder is associated with"),
  type: z.string().describe("Type of reminder (e.g., 'email', 'push', 'sms')"),
  time: z.coerce.number().describe("Minutes before due date to send reminder"),
  message: z.string().optional().nullable()
    .describe("Custom message content for the reminder"),
});

// Progress entity schema
export const ProgressSchema = z.object({
  id: z.string().describe("Unique identifier for this progress record"),
  milestoneId: z.string().describe("ID of the milestone this progress update relates to"),
  goalId: z.string().describe("ID of the parent goal for quick reference"),
  previousPercentage: z.coerce.number().min(0).max(100)
    .describe("Completion percentage before this update"),
  newPercentage: z.coerce.number().min(0).max(100)
    .describe("Completion percentage after this update"),
  note: z.string().optional().nullable()
    .describe("Optional note explaining the progress change or context"),
  recordedAt: z.coerce.number().describe("Timestamp when this progress was recorded"),
  recordedBy: z.string().describe("User ID of the person who recorded this progress update"),
});

// Notifications entity schema
export const NotificationSchema = z.object({
  id: z.string().describe("Unique identifier for the notification"),
  userId: z.string().describe("ID of the user who should receive this notification"),
  type: NotificationTypeSchema.describe("Category of notification for appropriate handling"),
  title: z.string().describe("Short, descriptive title for the notification"),
  message: z.string().describe("Full notification message content"),
  goalId: z.string().optional().nullable()
    .describe("ID of related goal, if applicable"),
  milestoneId: z.string().optional().nullable()
    .describe("ID of related milestone, if applicable"),
  taskId: z.string().optional().nullable()
    .describe("ID of related task, if applicable"),
  read: z.boolean().describe("Whether the user has read this notification"),
  createdAt: z.coerce.number().describe("Timestamp when the notification was created"),
  scheduledFor: z.coerce.number().optional().nullable()
    .describe("Timestamp when the notification should be delivered (for scheduled notifications)"),
});

// Calendar Events entity schema
export const CalendarEventSchema = z.object({
  id: z.string().describe("Unique identifier for the calendar event record"),
  goalId: z.string().optional().nullable()
    .describe("ID of associated goal, if this event represents a goal"),
  milestoneId: z.string().optional().nullable()
    .describe("ID of associated milestone, if this event represents a milestone deadline"),
  taskId: z.string().optional().nullable()
    .describe("ID of associated task, if this event represents a task due date"),
  eventType: EventTypeSchema.describe("Type of event for proper categorization and display"),
  calendarId: z.string().describe("ID of the calendar where this event is stored"),
  eventId: z.string().describe("External calendar system's event ID for synchronization"),
  title: z.string().describe("Event title as it appears in the calendar"),
  startDate: z.coerce.number().describe("Event start timestamp"),
  endDate: z.coerce.number().describe("Event end timestamp"),
  allDay: z.boolean().describe("Whether this is an all-day event"),
  createdAt: z.coerce.number().describe("Timestamp when the calendar event was created"),
  updatedAt: z.coerce.number().optional().nullable()
    .describe("Timestamp when the calendar event was last modified"),
});

export const MessageSchema = z.object({
  id: z.string().describe("Unique identifier for the message"),
  chatId: z.string().describe("ID of the chat this message belongs to"),
  userId: z.string().describe("ID of the user who sent the message"),
  content: z.string().min(1, "Message cannot be empty").describe("The message content"),
  attachments: z.array(z.object({
    type: z.string().describe("Type of attachment (e.g., 'image', 'file', 'audio')"),
    url: z.string().describe("URL or path to the attachment"),
    name: z.string().describe("Original filename or title of the attachment"),
    size: z.number().optional().describe("Size of the attachment in bytes"),
  })).optional().default([]),
  isAI: z.boolean().default(false).describe("Whether the message is from AI"),
  createdAt: z.coerce.number().describe("Timestamp when the message was created").default(Date.now()),
  updatedAt: z.coerce.number().optional().nullable()
    .describe("Timestamp when the message was last modified").default(Date.now()),
});

export const CreateMessageSchema = MessageSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateMessageSchema = CreateMessageSchema.partial();

export const ChatSchema = z.object({
  id: z.string().describe("Unique identifier for the chat"),
  title: z.string().describe("Title of the chat"),
  userId: z.string().describe("ID of the user who owns this chat"),
  createdAt: z.coerce.number().describe("Timestamp when the chat was created").default(Date.now()),
  updatedAt: z.coerce.number().optional().nullable()
    .describe("Timestamp when the chat was last modified").default(Date.now()),
});


export const CreateChatSchema = ChatSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const UpdateChatSchema = CreateChatSchema.partial().extend({
  updatedAt: z.coerce.number().describe("Timestamp when the chat was last updated"),
});


// Input schemas for creating/updating (without id and timestamps)
export const CreateUserSchema = UserSchema.omit({ id: true });
export const UpdateUserSchema = CreateUserSchema.partial();

export const CreateGoalSchema = GoalSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  overallProgress: true // This should be calculated
}).strict();
export const UpdateGoalSchema = CreateGoalSchema.partial().extend({
  updatedAt: z.string().describe("Timestamp when the goal was last updated"),
}).strict();

export const CreateMilestoneSchema = MilestoneSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const UpdateMilestoneSchema = CreateMilestoneSchema.partial().extend({
  updatedAt: z.coerce.number().describe("Timestamp when the milestone was last updated"),
});

export const CreateTaskSchema = TaskSchema.omit({
  id: true,
  
}).extend({
  // Alarm settings
  hasAlarm: z.boolean().default(false)
    .describe("Whether this task has alarm notifications enabled"),
  alarm: AlarmSchema.array().optional().nullable()
    .describe("Array of alarm configurations for this task"),
});
export const UpdateTaskSchema = CreateTaskSchema.partial().extend({
  updatedAt: z.coerce.number().describe("Timestamp when the task was last updated"),
});

export const CreateProgressSchema = ProgressSchema.omit({
  id: true,
  recordedAt: true,
});

export const CreateNotificationSchema = NotificationSchema.omit({
  id: true,
  createdAt: true,
});

export const CreateCalendarEventSchema = CalendarEventSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const UpdateCalendarEventSchema =
  CreateCalendarEventSchema.partial().extend({
    updatedAt: z.coerce.number().describe("Timestamp when the calendar event was last updated"),
  });

// Type exports for TypeScript usage
export type User = z.infer<typeof UserSchema>;
export type Goal = z.infer<typeof GoalSchema>;
export type Milestone = z.infer<typeof MilestoneSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type Progress = z.infer<typeof ProgressSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type CalendarEvent = z.infer<typeof CalendarEventSchema>;

export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type CreateGoal = z.infer<typeof CreateGoalSchema>;
export type UpdateGoal = z.infer<typeof UpdateGoalSchema>;
export type CreateMilestone = z.infer<typeof CreateMilestoneSchema>;
export type UpdateMilestone = z.infer<typeof UpdateMilestoneSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
export type CreateProgress = z.infer<typeof CreateProgressSchema>;
export type CreateNotification = z.infer<typeof CreateNotificationSchema>;
export type CreateCalendarEvent = z.infer<typeof CreateCalendarEventSchema>;
export type UpdateCalendarEvent = z.infer<typeof UpdateCalendarEventSchema>;

// Validation utility functions
export const validateUser = (data: unknown) => UserSchema.parse(data);
export const validateGoal = (data: unknown) => GoalSchema.parse(data);
export const validateMilestone = (data: unknown) => MilestoneSchema.parse(data);
export const validateTask = (data: unknown) => TaskSchema.parse(data);
export const validateProgress = (data: unknown) => ProgressSchema.parse(data);
export const validateNotification = (data: unknown) =>
  NotificationSchema.parse(data);
export const validateCalendarEvent = (data: unknown) =>
  CalendarEventSchema.parse(data);