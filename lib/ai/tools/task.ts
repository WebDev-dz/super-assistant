import { tool } from "ai";
import z from "zod";
import { zodSchema } from 'ai';
import { PrioritySchema } from "@/lib/validations";


export const TodoAiSchema = z.object({
    title: z.string().describe("Clear, actionable title describing what needs to be done"),
    description: z.string().refine((val) => val !== null)
      .describe("Detailed description of the task including specific steps or requirements"),
    completed: z.boolean().describe("Whether this task has been completed"),
    priority: PrioritySchema.describe("Priority level for task scheduling and focus"),
  
    // Dates
    dueDate: z.string()
      .describe("When this task should be completed"),
    
  
    // Time tracking
    estimatedHours: z.number().min(0)
      .describe("Estimated time required to complete this task"),
    actualHours: z.number().min(0)
      .describe("Actual time spent working on this task"),
  
    // Organization
    tags: z.array(z.string())
      .describe("Array of tags for organizing and filtering tasks"),
  });
  




export const createTodoListAi = tool({
    description: 'create Todo list to acheive what do I want',
    inputSchema: z.object({
            title: z.string().describe("Todod title")
        }),

    outputSchema: zodSchema(z.object({
        tasks: z.object({
            title: z.string().describe("Todod title")
        }).array()
    }), { useReferences: true})
})