export type Status = 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  category?: string;
  tags?: string[]; // Array of strings
  startDate: string; // ISO
  targetEndDate: string; // ISO
  actualEndDate?: string; // ISO
  createdAt: string; // ISO
  updatedAt?: string; // ISO
  overallProgress: number; // 0-100 (derived from milestones)
  owner?: string;
  budget?: number;
  estimatedTotalHours?: number;
  actualTotalHours?: number;
  calendarId?: string;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  percentage: number; // 0-100, contribution to goal
  completed: boolean;
  status: Status;
  priority: Priority;
  deadline: string; // ISO
  createdAt: string; // ISO
  updatedAt?: string; // ISO
  dependsOn?: string[]; // milestone IDs
  estimatedHours?: number;
  actualHours?: number;
  calendarEventId?: string;
  reminders?: Reminder[]; // Array of Alarm-like objects
}

export interface Todo {
  id: string;
  milestoneId?: string | null; // null => standalone todo
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string; // ISO
  createdAt: string; // ISO
  updatedAt?: string; // ISO
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[]; // Array of strings
}

export interface Reminder {
  id: string;
  title: string;
  scheduledFor: string; // ISO
  createdAt: string; // ISO
  note?: string;
  entityType: 'milestone' | 'task';
  entityId: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'milestone_due' | 'goal_overdue' | 'task_assigned' | 'progress_update';
  title: string;
  message: string;
  goalId?: string;
  milestoneId?: string;
  taskId?: string;
  read: boolean;
  createdAt: string; // ISO
  scheduledFor?: string; // ISO
}

export interface CalendarEvent {
  id: string;
  goalId?: string;
  milestoneId?: string;
  taskId?: string;
  eventType: 'goal' | 'milestone' | 'task' | 'reminder';
  calendarId: string;
  eventId: string;
  title: string;
  startDate: string; // ISO
  endDate: string; // ISO
  allDay: boolean;
  createdAt: string; // ISO
  updatedAt?: string; // ISO
}

export interface DataState {
  goals: Goal[];
  milestones: Milestone[];
  tasks: Todo[];
  notifications: Notification[];
  calendarEvents: CalendarEvent[];
}

export type PartialDeep<T> = {
  [K in keyof T]?: T[K] extends object ? PartialDeep<T[K]> : T[K];
};
