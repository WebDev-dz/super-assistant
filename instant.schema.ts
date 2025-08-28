import { i, id } from "@instantdb/react-native";
import db from "./db";

type DayName = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

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
      image: i.string().optional(),
      status: i.string().indexed(), // 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'
      // priority: i.string().indexed().optional(), // 'low' | 'medium' | 'high' | 'urgent'
      category: i.string().indexed().optional(),
      // Dates
      startDate: i.date(),
      // targetEndDate: i.date(),
      // actualEndDate: i.date().optional(),
      createdAt: i.date(),
      updatedAt: i.date().optional(),
      // Progress tracking
      overallProgress: i.number(), // 0-100, calculated from habits
      owner: i.string().indexed(), // User ID
    }),
    
    habits: i.entity({
      id: i.string().indexed(),
      goalId: i.string().indexed(),
      title: i.string().indexed(),
      note: i.string().optional(),
      completedDays: i.json<Date[]>(),
      status: i.string().indexed(), // 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'
      priority: i.string().indexed(), // 'low' | 'medium' | 'high' | 'urgent'
      
      days: i.json<DayName[]>(), // Array of Alarm objects
      // Dates
      createdAt: i.date(),
      updatedAt: i.date().optional(),
    }),
    
    tasks: i.entity({
      id: i.string().indexed(),
      goalId: i.string().indexed(),
      title: i.string().indexed(),
      description: i.string().optional(),
      completed: i.boolean(),
      priority: i.string().indexed(), // 'low' | 'medium' | 'high' | 'urgent'
      
      // Dates
      dueDate: i.date().optional(),
      createdAt: i.date(),
      updatedAt: i.date().optional(),

    }),
    
    // For progress tracking and history
    progress: i.entity({
      id: i.string().indexed().unique(),
      habitId: i.string().indexed(),
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
      type: i.string().indexed(), // 'habit_due' | 'goal_overdue' | 'task_assigned' | 'progress_update'
      title: i.string(),
      message: i.string(),
      goalId: i.string().optional(),
      habitId: i.string().optional(),
      taskId: i.string().optional(),
      read: i.boolean(),
      createdAt: i.date(),
      scheduledFor: i.date().optional(),
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
    
    // Goal has multiple habits
    goalHabits: {
      forward: {
        on: "habits",
        label: "goal",
        has: "one"
      },
      reverse: {
        on: "goals",
        label: "habits",
        onDelete: "cascade", // Cascade delete habits when goal is deleted
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

    // Additional notification relationships for goals, habits, and tasks
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

    notificationHabit: {
      forward: {
        on: "notifications",
        label: "habit",
        has: "one"
      },
      reverse: {
        on: "habits",
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


export type { AppSchema };

const wakaTime="waka_29579f2f-5e41-4fa8-8e7f-4114bb07da9a"

export default schema;

