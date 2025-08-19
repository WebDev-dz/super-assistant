import * as React from 'react';
import { id as instantId, UpdateParams } from '@instantdb/react';
import type { CalendarEvent, DataState, Goal, Milestone, Notification, Todo } from '@/lib/types';
import db from '@/db';
import { GoalsHandlers, goalsHandlers } from '@/lib/handlers/goals';
import { milestonesHandlers, MilestonesHandlers } from '@/lib/handlers/milestones';
import { tasksHandlers, TasksHandlers } from '@/lib/handlers/tasks';
import { eventsHandlers, EventsHandlers } from '@/lib/handlers/events';
import { notificationsHandlers, NotificationsHandlers } from '@/lib/handlers/notifications';
import { GoalsActions, goalsActions } from '@/lib/actions/goals';
import { MilestonesActions, milestonesActions } from '@/lib/actions/milestones';
import { TasksActions, tasksActions } from '@/lib/actions/tasks';
import { EventsActions, eventsActions } from '@/lib/actions/events';
import { NotificationsActions, notificationsActions } from '@/lib/actions/notifications';
import { AppSchema } from '@/instant.schema';
import * as Calendar from 'expo-calendar';
import { chatsActions, ChatsActions } from '@/lib/actions/chats';
import { chatsHandlers } from '@/lib/handlers/chats';

// InstantDB-backed data provider. Requires NEXT_PUBLIC_INSTANT_APP_ID to be set.
type  Ctx = GoalsActions & MilestonesActions & TasksActions & EventsActions & NotificationsActions & ChatsActions & {
  state: DataState;
  isLoading: boolean;
  error: any;
  
  goalProgress: (goalId: string) => number;
  milestoneProgress: (milestoneId: string) => number;

  handleAddReminderForMilestone: (milestoneId: string, title: string, whenISO: string, note?: string) => Promise<void>;
  handleAddReminderForTask: (taskId: string, title: string, whenISO: string, note?: string) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  deleteBulkReminders: (ids: string[]) => Promise<void>;
  scheduleNotification: (notification: UpdateParams<AppSchema, "notifications">) => Promise<any>;
  cancelScheduledNotification: (notificationId: string) => Promise<void>;
  cancelAllScheduledNotifications: () => Promise<void>;
};

const HandlersContext = React.createContext< Ctx | null>(null);

function computeMilestoneProgress(tasks: Todo[], milestoneId: string, msCompleted: boolean) {
  const ts = tasks.filter((t) => t.milestoneId === milestoneId);
  if (ts.length === 0) return msCompleted ? 100 : 0;
  const done = ts.filter((t) => t.completed).length;
  return Math.round((done / ts.length) * 100);
}

export function InstantDataProvider({ children, ownerId }: { children: React.ReactNode; ownerId: string }) {

  const [calendar, setCalendar] = React.useState<Calendar.Calendar | null>(null);
  const [calendarPermission, setCalendarPermission] = React.useState<Calendar.PermissionStatus | null>(null);

  // Initialize calendar permissions
  React.useEffect(() => {
    const initializeCalendarPermissions = async () => {
      try {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        setCalendarPermission(status);

        if (status === Calendar.PermissionStatus.GRANTED) {
          // const defaultCalendar = await Calendar.getCalendarsAsync();
          // setCalendar(defaultCalendar);
        }
      } catch (error) {
        console.error('Error initializing calendar:', error);
      }
    };

    initializeCalendarPermissions();
  }, []);
 
  if (!db) {
    throw new Error('InstantDB not configured. Add NEXT_PUBLIC_INSTANT_APP_ID.');
  }

  // Reactive query for current user's data
  const query = db.useQuery({
    goals: { $: { where: { owner: ownerId }} },
    milestones: {},
    tasks: {},
    notifications: {},
    calendarEvents: {},
  });

  const loading = query.isLoading;
  const data = query.data;
  
  const goals: Goal[] = React.useMemo(() => (data?.goals ?? []) as any, [data]);
  const milestones: Milestone[] = React.useMemo(() => (data?.milestones ?? []) as any, [data]);
  const tasks: Todo[] = React.useMemo(() => (data?.tasks ?? []) as any, [data]);
  const notifications: Notification[] = React.useMemo(() => (data?.notifications ?? []) as any, [data]);
  const calendarEvents: CalendarEvent[] = React.useMemo(() => (data?.calendarEvents ?? []) as any, [data]);


  // Calendar initialization is now handled in the initialization effect above

  // Derived goal progress
  const milestoneProgress = (milestoneId: string) => {
    const ms = milestones.find((m) => m.id === milestoneId);
    return computeMilestoneProgress(tasks, milestoneId, Boolean(ms?.completed));
  };

  const goalProgress = (goalId: string) => {
    const ms = milestones.filter((m) => m.goalId === goalId);
    if (ms.length === 0) return 0;
    const total = ms.reduce((acc, m) => {
      const mProg = milestoneProgress(m.id);
      return acc + (m.percentage * (mProg / 100));
    }, 0);
    return Math.max(0, Math.min(100, Math.round(total)));
  };

  // Goals handlers with actions
  const createGoal:  Ctx['createGoal'] = async (g) => {
    const handlers = await goalsHandlers.handleCreateGoal(g);
    try {
      const result = await goalsActions.createGoal(g);
      handlers.success();
      return result;
    } catch (error) {
      handlers.error(error);
      throw error;
    }
  };

  const updateGoal:  Ctx['updateGoal'] = async (goal) => {
    try {
      const result = await goalsActions.updateGoal(goal);
      const handlers = await goalsHandlers.handleUpdateGoal(goal);
      handlers.success();
      return result;
    } catch (error) {
      const handlers = await goalsHandlers.handleUpdateGoal(goal);
      handlers.error(error);
      throw error;
    }
  };

  const deleteGoal:  Ctx['deleteGoal'] = async (id) => {
    try {
      // Remove related milestones first
      const relatedMilestones = milestones.filter((m) => m.goalId === id);
      await deleteBulkMilestones(relatedMilestones.map(m => m.id));
      
      await goalsActions.deleteGoal(id);
      const handlers = await goalsHandlers.handleDeleteGoal(id);
      handlers.success();
    } catch (error) {
      const handlers = await goalsHandlers.handleDeleteGoal(id);
      handlers.error(error);
      throw error;
    }
  };

  const deleteBulkGoals:  Ctx['deleteBulkGoals'] = async (goalIds) => {
    try {
      await goalsActions.deleteBulkGoals(goalIds);
      const handlers = await goalsHandlers.handleDeleteBulkGoals(goalIds);
      handlers.success();
    } catch (error) {
      const handlers = await goalsHandlers.handleDeleteBulkGoals(goalIds);
      handlers.error(error);
      throw error;
    }
  };

  // Milestones handlers with actions
  const createMilestone:  Ctx['createMilestone'] = async (m) => {
    try {
      const newId = instantId();
      const now = new Date().toISOString();
      const milestone: Required<UpdateParams<AppSchema, "milestones">> = {
        ...m,
        id: newId,
        createdAt: now,
        completed: false,
      };
      
      const result = await milestonesActions.createMilestone(milestone);
      const handlers = await milestonesHandlers.handleCreateMilestone(milestone);
      handlers.success();
      return result;
    } catch (error) {
      const newId = instantId();
      const now = new Date().toISOString();
      const milestone: Required<UpdateParams<AppSchema, "milestones">> = {
        ...m,
        id: newId,
        createdAt: now,
        completed: false,
      };
      const handlers = await milestonesHandlers.handleCreateMilestone(milestone);
      handlers.error(error);
      throw error;
    }
  };

  const updateMilestone:  Ctx['updateMilestone'] = async (milestone) => {
    try {
      const result = await milestonesActions.updateMilestone(milestone);
      const handlers = await milestonesHandlers.handleUpdateMilestone(milestone);
      handlers.success();
      return result;
    } catch (error) {
      const handlers = await milestonesHandlers.handleUpdateMilestone(milestone);
      handlers.error(error);
      throw error;
    }
  };

  const deleteMilestone:  Ctx['deleteMilestone'] = async (id) => {
    try {
      // Remove related tasks first
      const relatedTasks = tasks.filter((t) => t.milestoneId === id);
      await deleteBulkTasks(relatedTasks.map(t => t.id));
      
      await milestonesActions.deleteMilestone(id);
      const handlers = await milestonesHandlers.handleDeleteMilestone(id);
      handlers.success();
    } catch (error) {
      const handlers = await milestonesHandlers.handleDeleteMilestone(id);
      handlers.error(error);
      throw error;
    }
  };

  const deleteBulkMilestones:  Ctx['deleteBulkMilestones'] = async (milestoneIds) => {
    try {
      await milestonesActions.deleteBulkMilestones(milestoneIds);
      const handlers = await milestonesHandlers.handleDeleteBulkMilestones(milestoneIds);
      handlers.success();
    } catch (error) {
      const handlers = await milestonesHandlers.handleDeleteBulkMilestones(milestoneIds);
      handlers.error(error);
      throw error;
    }
  };

  // Tasks handlers with actions
  const createTask:  Ctx['createTask'] = async (task) => {
    try {
      const result = await tasksActions.createTask(task);
      const handlers = await tasksHandlers.handleCreateTask(task as any);
      handlers.success();
      return result;
    } catch (error) {
      const handlers = await tasksHandlers.handleCreateTask(task as any);
      handlers.error(error);
      throw error;
    }
  };

  const updateTask:  Ctx['updateTask'] = async (task) => {
    try {
      const result = await tasksActions.updateTask(task);
      const handlers = await tasksHandlers.handleUpdateTask(task);
      handlers.success();
      return result;
    } catch (error) {
      const handlers = await tasksHandlers.handleUpdateTask(task);
      handlers.error(error);
      throw error;
    }
  };

  const deleteTask:  Ctx['deleteTask'] = async (id) => {
    try {
      const events = calendarEvents.filter((e) => e.taskId === id);
      const notifs = notifications.filter((n) => n.taskId === id); 
      await deleteBulkEvents(events.map(e => e.id));
      await deleteBulkNotifications(notifs.map(n => n.id));
      
      await tasksActions.deleteTask(id);
      const handlers = await tasksHandlers.handleDeleteTask(id);
      handlers.success();
    } catch (error) {
      const handlers = await tasksHandlers.handleDeleteTask(id);
      handlers.error(error);
      throw error;
    }
  };

  const deleteBulkTasks:  Ctx['deleteBulkTasks'] = async (taskIds) => {
    try {
      await tasksActions.deleteBulkTasks(taskIds);
      const handlers = await tasksHandlers.handleDeleteBulkTasks(taskIds);
      handlers.success();
    } catch (error) {
      const handlers = await tasksHandlers.handleDeleteBulkTasks(taskIds);
      handlers.error(error);
      throw error;
    }
  };



   // Chats handlers with actions
   const createChat:  Ctx['createChat'] = async (g) => {
    const handlers = await chatsHandlers.handleCreateChat(g);
    try {
      const result = await chatsActions.createChat(g);
      handlers.success();
      return result;
    } catch (error) {
      handlers.error(error);
      throw error;
    }
  };

  const updateChat:  Ctx['updateChat'] = async (chat) => {
    try {
      const result = await chatsActions.updateChat(chat);
      const handlers = await chatsHandlers.handleUpdateChat(chat);
      handlers.success();
      return result;
    } catch (error) {
      const handlers = await chatsHandlers.handleUpdateChat(chat);
      handlers.error(error);
      throw error;
    }
  };

  const deleteChat:  Ctx['deleteChat'] = async (id) => {
    try {
      // Remove related milestones first
      // const relatedMessages = messages.filter((m) => m.chatId === id);
      // await deleteBulkMessages(relatedMessages.map(m => m.id));
      
      await chatsActions.deleteChat(id);
      const handlers = await chatsHandlers.handleDeleteChat(id);
      handlers.success();
    } catch (error) {
      const handlers = await chatsHandlers.handleDeleteChat(id);
      handlers.error(error);
      throw error;
    }
  };

  const deleteBulkChats:  Ctx['deleteBulkChats'] = async (chatIds) => {
    try {
      await chatsActions.deleteBulkChats(chatIds);
      const handlers = await chatsHandlers.handleDeleteBulkChats(chatIds);
      handlers.success();
    } catch (error) {
      const handlers = await chatsHandlers.handleDeleteBulkChats(chatIds);
      handlers.error(error);
      throw error;
    }
  };

  // Events handlers with actions
  const createEvent:  Ctx['createEvent'] = async (event) => {
    try {
      const result = await eventsActions.createEvent(event);
      const handlers = await eventsHandlers.handleCreateEvent(event);
      handlers.success();
      return result;
    } catch (error) {
      const handlers = await eventsHandlers.handleCreateEvent(event);
      handlers.error(error);
      throw error;
    }
  };

  const updateEvent:  Ctx['updateEvent'] = async (event) => {
    try {
      const result = await eventsActions.updateEvent(event);
      const handlers = await eventsHandlers.handleUpdateEvent(event);
      handlers.success();
      return result;
    } catch (error) {
      const handlers = await eventsHandlers.handleUpdateEvent(event);
      handlers.error(error);
      throw error;
    }
  };

  const deleteEvent:  Ctx['deleteEvent'] = async (eventId) => {
    try {
      await eventsActions.deleteEvent(eventId);
      const handlers = await eventsHandlers.handleDeleteEvent(eventId);
      handlers.success();
    } catch (error) {
      const handlers = await eventsHandlers.handleDeleteEvent(eventId);
      handlers.error(error);
      throw error;
    }
  };

  const deleteBulkEvents:  Ctx['deleteBulkEvents'] = async (eventIds) => {
    if (eventIds.length === 0) return;
    try {
      await eventsActions.deleteBulkEvents(eventIds);
      const handlers = await eventsHandlers.handleDeleteBulkEvents(eventIds);
      handlers.success();
    } catch (error) {
      const handlers = await eventsHandlers.handleDeleteBulkEvents(eventIds);
      handlers.error(error);
      throw error;
    }
  };

  // Notifications handlers with actions
  const createNotification:  Ctx['createNotification'] = async (notification) => {
    try {
      const result = await notificationsActions.createNotification(notification);
      const handlers = await notificationsHandlers.handleCreateNotification(notification);
      handlers.success();
      return result;
    } catch (error) {
      const handlers = await notificationsHandlers.handleCreateNotification(notification);
      handlers.error(error);
      throw error;
    }
  };

  const updateNotification:  Ctx['updateNotification'] = async (notification) => {
    try {
      const result = await notificationsActions.updateNotification(notification);
      const handlers = await notificationsHandlers.handleUpdateNotification(notification);
      handlers.success();
      return result;
    } catch (error) {
      const handlers = await notificationsHandlers.handleUpdateNotification(notification);
      handlers.error(error);
      throw error;
    }
  };

  const deleteNotification:  Ctx['deleteNotification'] = async (notificationId) => {
    try {
      await notificationsActions.deleteNotification(notificationId);
      const handlers = await notificationsHandlers.handleDeleteNotification(notificationId);
      handlers.success();
    } catch (error) {
      const handlers = await notificationsHandlers.handleDeleteNotification(notificationId);
      handlers.error(error);
      throw error;
    }
  };

  const deleteBulkNotifications:  Ctx['deleteBulkNotifications'] = async (notificationIds) => {
    if (notificationIds.length === 0) return;
    try {
      await notificationsActions.deleteBulkNotifications(notificationIds);
      const handlers = await notificationsHandlers.handleDeleteBulkNotifications(notificationIds);
      handlers.success();
    } catch (error) {
      const handlers = await notificationsHandlers.handleDeleteBulkNotifications(notificationIds);
      handlers.error(error);
      throw error;
    }
  };

  const scheduleNotification:  Ctx['scheduleNotification'] = async (notification) => {
    try {
      const result = await notificationsActions.scheduleNotification(notification);
      const handlers = await notificationsHandlers.handleScheduleNotification(notification);
      handlers.success();
      return result;
    } catch (error) {
      const handlers = await notificationsHandlers.handleScheduleNotification(notification);
      handlers.error(error);
      throw error;
    }
  };

  const cancelScheduledNotification:  Ctx['cancelScheduledNotification'] = async (notificationId) => {
    try {
      await notificationsActions.cancelScheduledNotification(notificationId);
      const handlers = await notificationsHandlers.handleCancelScheduledNotification(notificationId);
      handlers.success();
    } catch (error) {
      const handlers = await notificationsHandlers.handleCancelScheduledNotification(notificationId);
      handlers.error(error);
      throw error;
    }
  };

  const cancelAllScheduledNotifications:  Ctx['cancelAllScheduledNotifications'] = async () => {
    try {
      await notificationsActions.cancelAllScheduledNotifications();
      const handlers = await notificationsHandlers.handleCancelAllScheduledNotifications();
      handlers.success();
    } catch (error) {
      const handlers = await notificationsHandlers.handleCancelAllScheduledNotifications();
      handlers.error(error);
      throw error;
    }
  };

  // Reminder helpers
  const handleAddReminderForMilestone:  Ctx['handleAddReminderForMilestone'] = async (milestoneId, title, whenISO, note) => {
    try {
      const notif = {
        id: instantId(),
        userId: ownerId,
        type: 'progress_update',
        title,
        message: note ?? '',
        milestoneId,
        read: false,
        createdAt: new Date().toISOString(),
        taskId: "",
        goalId: "",
        scheduledFor: whenISO,
      };
      await createNotification(notif);
    } catch (error) {
      console.error('Failed to add reminder for milestone:', error);
      throw error;
    }
  };

  const handleAddReminderForTask:  Ctx['handleAddReminderForTask'] = async (taskId, title, whenISO, note) => {
    try {
      const notif = {
        id: instantId(),
        userId: ownerId,
        type: 'progress_update',
        title,
        message: note ?? '',
        taskId,
        read: false,
        createdAt: new Date().toISOString(),
        goalId: "",
        milestoneId: "",
        scheduledFor: whenISO,
      };
      await createNotification(notif);
    } catch (error) {
      console.error('Failed to add reminder for task:', error);
      throw error;
    }
  };

  const deleteReminder:  Ctx['deleteReminder'] = async (id) => {
    try {
      await deleteNotification(id);
    } catch (error) {
      console.error('Failed to delete reminder:', error);
      throw error;
    }
  };

  const deleteBulkReminders:  Ctx['deleteBulkReminders'] = async (ids) => {
    try {
      await deleteBulkNotifications(ids);
    } catch (error) {
      console.error('Failed to delete bulk reminders:', error);
      throw error;
    }
  };

  const derivedGoals = goals.map((g) => ({ ...g, overallProgress: goalProgress(g.id) }));

  const value:  Ctx = {
    state: {
      goals: derivedGoals,
      milestones,
      tasks,
      notifications,
      calendarEvents,
    },
    isLoading: loading,
    error: query.error,
    
    // Goals handlers
    createGoal,
    updateGoal,
    deleteGoal,
    deleteBulkGoals,

    // Chats handlers
    createChat,
    updateChat,
    deleteChat,
    deleteBulkChats,

    // Milestones handlers
    createMilestone,
    updateMilestone,
    deleteMilestone,
    deleteBulkMilestones,

    // Tasks handlers  
    createTask,
    updateTask,
    deleteTask,
    deleteBulkTasks,

    // Events handlers
    createEvent,
    updateEvent,
    deleteEvent,
    deleteBulkEvents,

    // Notifications handlers
    createNotification,
    updateNotification,
    deleteNotification,
    deleteBulkNotifications,
    scheduleNotification,
    cancelScheduledNotification,
    cancelAllScheduledNotifications,

    // Progress and utilities
    goalProgress,
    milestoneProgress,
    handleAddReminderForMilestone,
    handleAddReminderForTask,
    deleteReminder,
    deleteBulkReminders,
  };

  return <HandlersContext.Provider value={value}>{children}</HandlersContext.Provider>;
}

export function useHandlers() {
  const ctx = React.useContext(HandlersContext);
  if (!ctx) throw new Error('useHandlers must be used within InstantDataProvider');
  return ctx;
}