import { i } from "@instantdb/react-native";

const _schema = i.schema({
  entities: {
    users: i.entity({
      email: i.string().unique().indexed().optional(),
      name: i.string().optional(),
    }),
    goals: i.entity({
      title: i.string().indexed(), // Specific: Clear goal description
      description: i.string().optional(), // Additional details for specificity
      measurableTarget: i.number().optional(), // Measurable: Quantifiable target (e.g., 10kg, 5 books)
      measurableUnit: i.string().optional(), // Unit of measurement (e.g., "kg", "books")
      isAchievable: i.boolean(), // Achievable: Flag to mark feasibility
      relevantCategory: i.string().indexed().optional(), // Relevant: Category like "Health", "Career"
      deadline: i.number().optional(), // Time-bound: Unix timestamp for deadline
      createdAt: i.number(), // When the goal was created
      updatedAt: i.number().optional(), // Last update timestamp
      status: i.string(), // "active", "completed", "archived"
    }),
    milestones: i.entity({
      goalId: i.string().indexed(), // Reference to parent goal
      title: i.string(), // Milestone description
      percentage: i.number(), // Percentage contribution to the goal (e.g., 25 for 25%)
      deadline: i.number().optional(), // Optional milestone deadline
      createdAt: i.number(), // When the milestone was created
      status: i.string(), // "pending", "completed"
    }),
    progress: i.entity({
      milestoneId: i.string().indexed(), // Reference to milestone
      value: i.number(), // Progress value for the milestone (e.g., 2kg for a milestone)
      note: i.string().optional(), // Optional note for progress update
      recordedAt: i.number(), // Timestamp of progress update
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
        on: "users",
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
    
    // Additional useful relation: User can view all progress through their goals
    userProgress: {
      forward: {
        on: "progress",
        label: "user",
        has: "one"
      },
      reverse: {
        on: "users",
        label: "allProgress",
        has: "many"
      }
    }
  },
  rooms: {},
});

// Enhance TypeScript intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;