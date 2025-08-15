import { GoalSchema, MilestoneSchema, TaskSchema, StatusSchema, PrioritySchema } from "../validations";

// Prompt generator for creating a Goal with Milestones and Tasks
export const createGoalWithStepsPrompt = (userInput: string, userId: string, ) => {
  const basePrompt = `
You are a goal planning assistant. Your task is to help the user bring their goal to life by creating a structured plan. Based on the user's input, generate a JSON object that includes a goal, associated milestones, and actionable tasks (to-do steps) to achieve the goal. The output must strictly adhere to the following schemas and constraints from a goal management system:

**Goal Schema**:
${JSON.stringify(GoalSchema.shape, null, 2)}

**Milestone Schema**:
${JSON.stringify(MilestoneSchema.shape, null, 2)}

**Task Schema**:
${JSON.stringify(TaskSchema.shape, null, 2)}

**Instructions**:
- User input: "${userInput}".
- Generate a JSON object with three properties: "goal", "milestones", and "tasks".
  - "goal": A single object conforming to GoalSchema.
  - "milestones": An array of 1-5 objects, each conforming to MilestoneSchema.
  - "tasks": An array of 2-10 objects, each conforming to TaskSchema, distributed across the milestones.
- **Goal Requirements**:
  - Required fields: title (min 3 characters), status, priority, startDate, targetEndDate, owner, overallProgress.
  - Set owner to "${userId}".
  - Set overallProgress to 0 for a new goal.
  - Use ISO date strings (e.g., "2025-08-15T12:00:00Z") for startDate, targetEndDate, and createdAt.
  - Optional fields (description, category, tags, budget, estimatedTotalHours, actualTotalHours, calendarId) can be included based on input or set to null.
  - Status must be one of: ${StatusSchema.options.join(", ")}.
  - Priority must be one of: ${PrioritySchema.options.join(", ")}.
- **Milestone Requirements**:
  - Required fields: id (generate a UUID), goalId (match the goal's id), title, percentage (0-100, sum across milestones should approximate 100), completed, status, priority, deadline, createdAt.
  - Set completed to false for new milestones.
  - Use ISO date strings for deadline and createdAt.
  - Optional fields (description, dependsOn, estimatedHours, actualHours, calendarEventId, reminders) can be included or set to null.
  - Assign milestones sequential deadlines that align with the goal’s startDate and targetEndDate.
  - If applicable, set dependsOn to reference other milestone IDs for sequential tasks.
- **Task Requirements**:
  - Required fields: id (generate a UUID), milestoneId (match a milestone’s id), title, completed, priority, createdAt.
  - Set completed to false for new tasks.
  - Use ISO date strings for dueDate and createdAt.
  - Optional fields (description, estimatedHours, actualHours, tags) can be included or set to null.
  - Distribute tasks across milestones, ensuring each milestone has at least one task.
  - Priority must be one of: ${PrioritySchema.options.join(", ")}.
- **General Guidelines**:
  - Interpret the user’s input to create a realistic, actionable plan. If the input is vague, make reasonable assumptions to define the goal, break it into milestones, and create specific tasks.
  - Ensure milestones and tasks are logically sequenced and contribute to achieving the goal.
  - Set realistic dates, assuming the current date is ${new Date().toISOString().split('T')[0]}.
  - If the input suggests a category (e.g., health, career), reflect it in the goal’s category and tags.
  - Include reminders for milestones if relevant (e.g., push notifications 1-2 days before deadlines).
  - Return only the JSON object, no additional text or explanations.

**Example Output**:
{
  "goal": {
    "title": "Run a Half Marathon",
    "description": "Train to successfully complete a 21km half marathon",
    "status": "not_started",
    "priority": "high",
    "category": "Health",
    "tags": ["fitness", "running"],
    "startDate": "2025-08-15T00:00:00Z",
    "targetEndDate": "2025-12-15T23:59:59Z",
    "actualEndDate": null,
    "createdAt": "2025-08-15T08:12:00Z",
    "updatedAt": null,
    "overallProgress": 0,
    "owner": "${userId}",
    "budget": 200,
    "estimatedTotalHours": 100,
    "actualTotalHours": null,
    "calendarId": null
  },
  "milestones": [
    {
      "id": "${crypto.randomUUID()}",
      "goalId": "<goal-id>",
      "title": "Build Running Stamina",
      "description": "Develop baseline fitness for running",
      "percentage": 30,
      "completed": false,
      "status": "not_started",
      "priority": "medium",
      "deadline": "2025-09-15T23:59:59Z",
      "createdAt": "2025-08-15T08:12:00Z",
      "updatedAt": null,
      "dependsOn": null,
      "estimatedHours": 30,
      "actualHours": null,
      "calendarEventId": null,
      "reminders": [
        {
          "type": "push",
          "time": 1440,
          "message": "Stamina training milestone due soon"
        }
      ]
    },
    {
      "id": "${crypto.randomUUID()}",
      "goalId": "<goal-id>",
      "title": "Increase Weekly Mileage",
      "description": "Run 30km per week consistently",
      "percentage": 40,
      "completed": false,
      "status": "not_started",
      "priority": "high",
      "deadline": "2025-11-01T23:59:59Z",
      "createdAt": "2025-08-15T08:12:00Z",
      "updatedAt": null,
      "dependsOn": ["<first-milestone-id>"],
      "estimatedHours": 50,
      "actualHours": null,
      "calendarEventId": null,
      "reminders": null
    }
  ],
  "tasks": [
    {
      "id": "${crypto.randomUUID()}",
      "milestoneId": "<first-milestone-id>",
      "title": "Run 5km three times this week",
      "description": "Complete three 5km runs to build stamina",
      "completed": false,
      "priority": "medium",
      "dueDate": "2025-08-22T23:59:59Z",
      "createdAt": "2025-08-15T08:12:00Z",
      "updatedAt": null,
      "estimatedHours": 3,
      "actualHours": null,
      "tags": ["running", "training"]
    },
    {
      "id": "${crypto.randomUUID()}",
      "milestoneId": "<second-milestone-id>",
      "title": "Plan weekly running schedule",
      "description": "Create a schedule to reach 30km per week",
      "completed": false,
      "priority": "high",
      "dueDate": "2025-10-01T23:59:59Z",
      "createdAt": "2025-08-15T08:12:00Z",
      "updatedAt": null,
      "estimatedHours": 2,
      "actualHours": null,
      "tags": ["planning", "running"]
    }
  ]
}
`;

  

  return `${basePrompt}\n`;
};