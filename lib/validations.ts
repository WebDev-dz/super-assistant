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
]);
export const PrioritySchema = z.enum(["low", "medium", "high", "urgent"]);
const NotificationTypeSchema = z.enum([
  "milestone_due",
  "goal_overdue",
  "task_assigned",
  "progress_update",
]);
const EventTypeSchema = z.enum(["goal", "milestone", "task", "reminder"]);

// User entity schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.email().optional().nullable(),
  name: z.string().optional().nullable(),
});

// Goals entity schema
export const GoalSchema = z.object({
  title: z.string().min(3, { message: "Goal title is required." }),
  description: z.string().optional().nullable(),
  status: StatusSchema,
  priority: PrioritySchema,
  category: z.coerce.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),

  // Dates
  startDate: z.coerce.string(),
  targetEndDate: z.coerce.string(),
  actualEndDate: z.coerce.string().optional().nullable(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().optional().nullable(),

  // Progress tracking
  overallProgress: z.coerce.number().min(0).max(100),

  owner: z.string(), // User ID

  // Resources
  budget: z.coerce.number().min(0).optional().nullable(),
  estimatedTotalHours: z.coerce.number().min(0).optional().nullable(),
  actualTotalHours: z.coerce.number().min(0).optional().nullable(),

  // Calendar integration
  calendarId: z.string().optional().nullable(),
});

// Milestones entity schema
export const MilestoneSchema = z.object({
  id: z.string(),
  goalId: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  percentage: z.coerce.number().min(0).max(100),
  completed: z.boolean(),
  status: StatusSchema,
  priority: PrioritySchema,

  // Dates
  deadline: z.coerce.string(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().optional().nullable(),

  // Dependencies
  dependsOn: z.array(z.string()).optional().nullable(), // Array of milestone IDs

  // Time tracking
  estimatedHours: z.coerce.number().min(0).optional().nullable(),
  actualHours: z.coerce.number().min(0).optional().nullable(),

  // Calendar integration
  calendarEventId: z.string().optional().nullable(),
  reminders: z
    .array(
      z.object({
        type: z.string(),
        time: z.coerce.number(),
        message: z.string().optional().nullable(),
      })
    )
    .optional().nullable(),
});

export const AlarmSchema = z.object({
  relativeOffset: z.number().optional().nullable(),
  absoluteDate: z.coerce.string().optional().nullable(),
  method: z.enum(["alert", "alarm"]).optional().nullable(),
  structuredLocation: z.object({
    title: z.string().optional().nullable(),
    proximity: z.string().optional().nullable(),
    radius: z.number().optional().nullable(),
    coords: z
      .object({
        latitude: z.number().optional().nullable(),
        longitude: z.number().optional().nullable(),
      })
      .optional().nullable(),
  }),
});
// Tasks entity schema
export const TaskSchema = z.object({
  id: z.string(),
  milestoneId: z.string(),
  title: z.string(),
  description: z.string().optional().nullable().refine((val) => val !== null ),
  completed: z.boolean(),
  priority: PrioritySchema,

  // Dates
  dueDate: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional().nullable(),

  // Time tracking
  estimatedHours: z.coerce.number().min(0).optional().nullable(),
  actualHours: z.coerce.number().min(0).optional().nullable(),

  // Alarm
  

  // Organization
  tags: z.array(z.string()).optional().nullable(),
});

// Expo Calendar Alarm

// Reminders entity schema
export const ReminderSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  type: z.string(),
  time: z.coerce.number(),
  message: z.string().optional().nullable(),
});

// Progress entity schema
export const ProgressSchema = z.object({
  id: z.string(),
  milestoneId: z.string(),
  goalId: z.string(),
  previousPercentage: z.coerce.number().min(0).max(100),
  newPercentage: z.coerce.number().min(0).max(100),
  note: z.string().optional().nullable(),
  recordedAt: z.coerce.number(),
  recordedBy: z.string(), // User ID
});

// Notifications entity schema
export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: NotificationTypeSchema,
  title: z.string(),
  message: z.string(),
  goalId: z.string().optional().nullable(),
  milestoneId: z.string().optional().nullable(),
  taskId: z.string().optional().nullable(),
  read: z.boolean(),
  createdAt: z.coerce.number(),
  scheduledFor: z.coerce.number().optional().nullable(),
});

// Calendar Events entity schema
export const CalendarEventSchema = z.object({
  id: z.string(),
  goalId: z.string().optional().nullable(),
  milestoneId: z.string().optional().nullable(),
  taskId: z.string().optional().nullable(),
  eventType: EventTypeSchema,
  calendarId: z.string(),
  eventId: z.string(), // External calendar event ID
  title: z.string(),
  startDate: z.coerce.number(),
  endDate: z.coerce.number(),
  allDay: z.boolean(),
  createdAt: z.coerce.number(),
  updatedAt: z.coerce.number().optional().nullable(),
});

// Input schemas for creating/updating (without id and timestamps)
export const CreateUserSchema = UserSchema.omit({ id: true });
export const UpdateUserSchema = CreateUserSchema.partial();

export const CreateGoalSchema = GoalSchema.omit({
  //   id: true,
  //   createdAt: true,
  //   updatedAt: true,
  //   overallProgress: true // This should be calculated
});
export const UpdateGoalSchema = CreateGoalSchema.partial().extend({
  updatedAt: z.coerce.number(),
});

export const CreateMilestoneSchema = MilestoneSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const UpdateMilestoneSchema = CreateMilestoneSchema.partial().extend({
  updatedAt: z.coerce.number(),
});

export const CreateTaskSchema = TaskSchema.omit({
  id: true,
  
}).extend({
  // Alarm settings
  hasAlarm: z.boolean().default(false),
  alarm: AlarmSchema.array().optional().nullable(),
});
export const UpdateTaskSchema = CreateTaskSchema.partial().extend({
  updatedAt: z.coerce.number(),
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
    updatedAt: z.coerce.number(),
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
