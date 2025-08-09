import { i, id } from "@instantdb/react-native";
import db from "./db";

const _schema = i.schema({
  entities: { 
    $users: i.entity({
      id: i.string().indexed(),
      email: i.string().unique().indexed(),
      name: i.string().optional(),
      password: i.string(),
    }),
    
    goals: i.entity({
      id: i.string().indexed(),
      title: i.string().indexed(),
      description: i.string().optional(),
      status: i.string().indexed(), // 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'
      priority: i.string().indexed(), // 'low' | 'medium' | 'high' | 'urgent'
      category: i.string().indexed().optional(),
      tags: i.json().optional(), // Array of strings
      // Dates
      startDate: i.date(),
      targetEndDate: i.date(),
      actualEndDate: i.date().optional(),
      createdAt: i.date(),
      updatedAt: i.date().optional(),
      
      // Progress tracking
      overallProgress: i.number(), // 0-100, calculated from milestones
      
      
      owner: i.string().indexed(), // User ID
      
      // Resources
      budget: i.number().optional(),
      estimatedTotalHours: i.number().optional(),
      actualTotalHours: i.number().optional(),
      
      // Calendar integration
      calendarId: i.string().optional(),
    }),
    
    milestones: i.entity({
      id: i.string().indexed(),
      goalId: i.string().indexed(),
      title: i.string().indexed(),
      description: i.string().optional(),
      percentage: i.number(), // 0-100, contribution to goal
      completed: i.boolean(),
      status: i.string().indexed(), // 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'
      priority: i.string().indexed(), // 'low' | 'medium' | 'high' | 'urgent'
      
      // Dates
      deadline: i.string(),
      createdAt: i.date(),
      updatedAt: i.date().optional(),
      
      // Dependencies
      dependsOn: i.json().optional(), // Array of milestone IDs
      
      // Time tracking
      estimatedHours: i.number().optional(),
      actualHours: i.number().optional(),
      
      // Calendar integration
      calendarEventId: i.string().optional(),
      reminders: i.json().optional(), // Array of Alarm objects
    }),
    
    tasks: i.entity({
      id: i.string().indexed(),
      milestoneId: i.string().indexed(),
      title: i.string().indexed(),
      description: i.string().optional(),
      completed: i.boolean(),
      priority: i.string().indexed(), // 'low' | 'medium' | 'high' | 'urgent'
      
      // Dates
      dueDate: i.date().optional(),
      createdAt: i.date(),
      updatedAt: i.date().optional(),
      
      // Time tracking
      estimatedHours: i.number().optional(),
      actualHours: i.number().optional(),
      
      // Organization
      tags: i.json().optional(), // Array of strings
    }),
    
    // For progress tracking and history
    progress: i.entity({
      id: i.string().indexed().unique(),
      milestoneId: i.string().indexed(),
      goalId: i.string().indexed(), // For easier querying
      previousPercentage: i.number(),
      newPercentage: i.number(),
      note: i.string().optional(),
      recordedAt: i.number(),
      recordedBy: i.string(), // User ID
    }),

    message: i.entity({
      id: i.string().indexed(),
      chatId: i.string().indexed(),
      role: i.string().indexed(), // 'user' | 'assistant' | 'system'
      createdAt: i.date(),
      parts: i.json(),
      attachments: i.json(),
      updatedAt: i.date().optional(),
    }),

    chat: i.entity({
      id: i.string().indexed(),
      title: i.string(),
      userId: i.string().indexed(),
      createdAt: i.date(),
      updatedAt: i.date().optional(),
      visibility: i.string() // 'public' | 'private'
    }),

    vote: i.entity({
      id: i.string().indexed(),
       chatId: i.string().indexed(),
       messageId: i.string().indexed(),
       isUpvoted: i.boolean()
    }),

    document: i.entity({
      id: i.string().indexed(),
      title: i.string(),
      content: i.string().optional(),
      kind: i.string().indexed(), // 'text' | 'image' | 'video' | 'audio' | 'pdf' | 'other'
      userId: i.string().indexed(),
      createdAt: i.date(),
    }),

    suggestion: i.entity({
    id: i.string(),
    documentId: i.string(),
    documentCreatedAt: i.date(),
    originalText: i.string(),
    suggestedText: i.string(),
    content: i.string(),
    isResolved: i.boolean(),
    userId: i.string(),
    createdAt: i.date()}),

    stream: i.entity({
      id: i.string().indexed(),
      chatId: i.string().indexed(),
      createdAt: i.date()}),

    
    // For notifications
    notifications: i.entity({
      id: i.string().indexed(),
      userId: i.string().indexed(),
      type: i.string().indexed(), // 'milestone_due' | 'goal_overdue' | 'task_assigned' | 'progress_update'
      title: i.string(),
      message: i.string(),
      goalId: i.string().optional(),
      milestoneId: i.string().optional(),
      taskId: i.string().optional(),
      read: i.boolean(),
      createdAt: i.date(),
      scheduledFor: i.date().optional(),
    }),
    
    // For calendar events integration
    calendarEvents: i.entity({
      id: i.string().indexed(),
      goalId: i.string().optional(),
      milestoneId: i.string().optional(),
      taskId: i.string().optional(),
      eventType: i.string().indexed(), // 'goal' | 'milestone' | 'task' | 'reminder'
      calendarId: i.string(),
      eventId: i.string(), // External calendar event ID
      title: i.string(),
      startDate: i.date(),
      endDate: i.date(),
      allDay: i.boolean(),
      createdAt: i.date(),
      updatedAt: i.date().optional(),
    }),
  },
  
  links: {
    // User owns multiple goals
    goalOwner: {
      forward: {
        on: "goals",
        label: "user",
        has: "one"
      },
      reverse: {
        on: "$users",
        label: "goals",
        has: "many"
      }
    },
    
    // Goal has multiple milestones
    goalMilestones: {
      forward: {
        on: "milestones",
        label: "goal",
        has: "one"
      },
      reverse: {
        on: "goals",
        label: "milestones",
        onDelete: "cascade", // Cascade delete milestones when goal is deleted
        has: "many"
      }
    },
    
    // Milestone has multiple tasks
    milestoneTasks: {
      forward: {
        on: "tasks",
        label: "milestone",
        has: "one"
      },
      reverse: {
        on: "milestones",
        label: "tasks",
        has: "many"
      }
    },
    
    // Milestone has multiple progress entries
    milestoneProgress: {
      forward: {
        on: "progress",
        label: "milestone",
        has: "one"
      },
      reverse: {
        on: "milestones",
        label: "progressEntries",
        has: "many"
      }
    },
    
    // Goal has multiple progress entries (through milestones)
    goalProgress: {
      forward: {
        on: "progress",
        label: "goal",
        has: "one",
        onDelete: "cascade", // Cascade delete progress entries when goal is deleted
      },
      reverse: {
        on: "goals",
        label: "progressEntries",
        has: "many"
      }
    },
    
    // User has multiple notifications
    userNotifications: {
      forward: {
        on: "notifications",
        label: "user",
        has: "one"
      },
      reverse: {
        on: "$users",
        label: "notifications",
        has: "many"
      }
    },
    
    // Calendar events relationships
    goalCalendarEvents: {
      forward: {
        on: "calendarEvents",
        label: "goal",
        has: "one",
        onDelete: "cascade" // Cascade delete calendar events when goal is deleted
      },
      reverse: {
        on: "goals",
        label: "calendarEvents",
        has: "many",
      }
    },
    
    milestoneCalendarEvents: {
      forward: {
        on: "calendarEvents",
        label: "milestone",
        has: "one"
      },
      reverse: {
        on: "milestones",
        label: "calendarEvents",
        has: "many"
      }
    },
    
    taskCalendarEvents: {
      forward: {
        on: "calendarEvents",
        label: "task",
        has: "one"
      },
      reverse: {
        on: "tasks",
        label: "calendarEvents",
        has: "many"
      }
    },
    
    // Progress tracking user relation
    progressRecorder: {
      forward: {
        on: "progress",
        label: "recorder",
        has: "one"
      },
      reverse: {
        on: "$users",
        label: "recordedProgress",
        has: "many"
      }
    },

    // Chat system relationships
    chatOwner: {
      forward: {
        on: "chat",
        label: "user",
        has: "one"
      },
      reverse: {
        on: "$users",
        label: "chats",
        has: "many"
      }
    },

    chatMessages: {
      forward: {
        on: "message",
        label: "chat",
        has: "one"
      },
      reverse: {
        on: "chat",
        label: "messages",
        has: "many"
      }
    },

    chatVotes: {
      forward: {
        on: "vote",
        label: "chat",
        has: "one"
      },
      reverse: {
        on: "chat",
        label: "votes",
        has: "many"
      }
    },

    messageVotes: {
      forward: {
        on: "vote",
        label: "message",
        has: "one"
      },
      reverse: {
        on: "message",
        label: "votes",
        has: "many"
      }
    },

    chatStreams: {
      forward: {
        on: "stream",
        label: "chat",
        has: "one"
      },
      reverse: {
        on: "chat",
        label: "streams",
        has: "many"
      }
    },

    // Document system relationships
    documentOwner: {
      forward: {
        on: "document",
        label: "user",
        has: "one"
      },
      reverse: {
        on: "$users",
        label: "documents",
        has: "many"
      }
    },

    documentSuggestions: {
      forward: {
        on: "suggestion",
        label: "document",
        has: "one"
      },
      reverse: {
        on: "document",
        label: "suggestions",
        has: "many"
      }
    },

    suggestionUser: {
      forward: {
        on: "suggestion",
        label: "user",
        has: "one"
      },
      reverse: {
        on: "$users",
        label: "suggestions",
        has: "many"
      }
    },

    // Additional notification relationships for goals, milestones, and tasks
    notificationGoal: {
      forward: {
        on: "notifications",
        label: "goal",
        has: "one",
        onDelete: "cascade"
      },
      reverse: {
        on: "goals",
        label: "notifications",
        has: "many"
      }
    },

    notificationMilestone: {
      forward: {
        on: "notifications",
        label: "milestone",
        has: "one"
      },
      reverse: {
        on: "milestones",
        label: "notifications",
        has: "many"
      }
    },

    notificationTask: {
      forward: {
        on: "notifications",
        label: "task",
        has: "one"
      },
      reverse: {
        on: "tasks",
        label: "notifications",
        has: "many"
      }
    },
  },
  
  rooms: {},
});

// Enhance TypeScript intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

type Goal = ReturnType<AppSchema['entities']['goals']["asType"]>["attrs"]; 

export type { AppSchema };
export default schema;

