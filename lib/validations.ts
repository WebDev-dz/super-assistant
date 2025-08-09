// lib/validations.ts
import { z } from 'zod';

// Enum schemas for consistent validation
export const StatusSchema = z.enum(['not_started', 'in_progress', 'on_hold', 'completed', 'cancelled']);
export const PrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);
const NotificationTypeSchema = z.enum(['milestone_due', 'goal_overdue', 'task_assigned', 'progress_update']);
const EventTypeSchema = z.enum(['goal', 'milestone', 'task', 'reminder']);

// User entity schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.email().optional(),
  name: z.string().optional(),
});

// Goals entity schema
export const GoalSchema = z.object({
  title: z.string().min(3, { message: 'Goal title is required.' }),
  description: z.string().optional(),
  status: StatusSchema,
  priority: PrioritySchema,
  category: z.coerce.string().optional(),
  tags: z.array(z.string()).optional(),
  
  // Dates
  startDate: z.coerce.string(),
  targetEndDate: z.coerce.string(),
  actualEndDate: z.coerce.string().optional(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().optional(),
  
  // Progress tracking
  overallProgress: z.coerce.number().min(0).max(100),
  
  owner: z.string(), // User ID
  
  // Resources
  budget: z.coerce.number().min(0).optional(),
  estimatedTotalHours: z.coerce.number().min(0).optional(),
  actualTotalHours: z.coerce.number().min(0).optional(),
  
  // Calendar integration
  calendarId: z.string().optional(),
});

// Milestones entity schema
export const MilestoneSchema = z.object({
  id: z.string(),
  goalId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  percentage: z.coerce.number().min(0).max(100),
  completed: z.boolean(),
  status: StatusSchema,
  priority: PrioritySchema,
  
  // Dates
  deadline: z.coerce.string(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().optional(),
  
  // Dependencies
  dependsOn: z.array(z.string()).optional(), // Array of milestone IDs
  
  // Time tracking
  estimatedHours: z.coerce.number().min(0).optional(),
  actualHours: z.coerce.number().min(0).optional(),
  
  // Calendar integration
  calendarEventId: z.string().optional(),
  reminders: z.array(z.object({
    type: z.string(),
    time: z.coerce.number(),
    message: z.string().optional(),
  })).optional(),
});

// Tasks entity schema
export const TaskSchema = z.object({
  id: z.string(),
  milestoneId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean(),
  priority: PrioritySchema,
  
  // Dates
  dueDate: z.coerce.number().optional(),
  createdAt: z.coerce.number(),
  updatedAt: z.coerce.number().optional(),
  
  // Time tracking
  estimatedHours: z.coerce.number().min(0).optional(),
  actualHours: z.coerce.number().min(0).optional(),
  
  // Organization
  tags: z.array(z.string()).optional(),
});

// Progress entity schema
export const ProgressSchema = z.object({
  id: z.string(),
  milestoneId: z.string(),
  goalId: z.string(),
  previousPercentage: z.coerce.number().min(0).max(100),
  newPercentage: z.coerce.number().min(0).max(100),
  note: z.string().optional(),
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
  goalId: z.string().optional(),
  milestoneId: z.string().optional(),
  taskId: z.string().optional(),
  read: z.boolean(),
  createdAt: z.coerce.number(),
  scheduledFor: z.coerce.number().optional(),
});

// Calendar Events entity schema
export const CalendarEventSchema = z.object({
  id: z.string(),
  goalId: z.string().optional(),
  milestoneId: z.string().optional(),
  taskId: z.string().optional(),
  eventType: EventTypeSchema,
  calendarId: z.string(),
  eventId: z.string(), // External calendar event ID
  title: z.string(),
  startDate: z.coerce.number(),
  endDate: z.coerce.number(),
  allDay: z.boolean(),
  createdAt: z.coerce.number(),
  updatedAt: z.coerce.number().optional(),
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
  updatedAt: true 
});
export const UpdateMilestoneSchema = CreateMilestoneSchema.partial().extend({
  updatedAt: z.coerce.number(),
});

export const CreateTaskSchema = TaskSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const UpdateTaskSchema = CreateTaskSchema.partial().extend({
  updatedAt: z.coerce.number(),
});

export const CreateProgressSchema = ProgressSchema.omit({ 
  id: true,
  recordedAt: true 
});

export const CreateNotificationSchema = NotificationSchema.omit({ 
  id: true,
  createdAt: true 
});

export const CreateCalendarEventSchema = CalendarEventSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const UpdateCalendarEventSchema = CreateCalendarEventSchema.partial().extend({
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
export const validateNotification = (data: unknown) => NotificationSchema.parse(data);
export const validateCalendarEvent = (data: unknown) => CalendarEventSchema.parse(data);