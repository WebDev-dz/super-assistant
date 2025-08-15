import { GoalSchema } from "@/lib/validations";
import { tool } from "ai";
import z from "zod";





export const goalTool = tool({
    description: 'Break down a goal into actionable steps',
    inputSchema: z.object({
        goal: z.object({
            title: z.string().min(1, "Goal title is required"),
            description: z.string().optional(),
            deadline: z.string().optional(),
            priority: z.enum(['low', 'medium', 'high']).optional(),
        }),
    }),
    outputSchema: z.object({
        goal: GoalSchema,
    })
})