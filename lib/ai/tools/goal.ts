import { GoalSchema, PrioritySchema, StatusSchema } from "@/lib/validations";
import { tool } from "ai";
import z from "zod";
import { zodSchema } from 'ai';

export const GoalAiSchema = z.object({
    title: z.string()
      .describe("Clear, descriptive title for the goal"),
    description: z.string().nullish()
      .describe("Detailed description explaining the goal's purpose and scope"),
    status: StatusSchema.describe("Current progress status of the goal"),
    priority: PrioritySchema.describe("Priority level for resource allocation and focus"),
    category: z.string()
      .describe("Category or domain this goal belongs to (e.g., 'Health', 'Career', 'Personal')"),
    tags: z.array(z.string()).nullish()
      .describe("Array of tags for organizing and filtering goals"),
  
    // Dates
    startDate: z.string().describe("When work on this goal begins (ISO date string)"),
    targetEndDate: z.string().describe("Planned completion date for the goal (ISO date string)"),
    actualEndDate: z.string()
      .describe("Actual completion date when goal is finished (ISO date string)"),
    
      
  
  
    // Resources
    budget: z.number()
      .describe("Budget allocated for achieving this goal (in currency units)"),
    estimatedTotalHours: z.number().min(0).nullish()
      .describe("Estimated total time required to complete the goal"),
    actualTotalHours: z.number().min(0)
      .describe("Actual time spent on the goal (updated from task time tracking)"),
  
    // Calendar integration
})



export const createGoalAi = tool({
    description: 'Break down a goal into actionable steps',
    inputSchema: zodSchema(z.any()),
    "outputSchema":zodSchema(GoalAiSchema),
})