import { GoalSchema } from "@/lib/validations";
import { tool } from "ai";
import z from "zod";
import { zodSchema } from 'ai';





export const createGoalAi = tool({
    description: 'Break down a goal into actionable steps',
    inputSchema: zodSchema(z.any()),
    "outputSchema":zodSchema(z.object({
        goal: GoalSchema,
    }), {useReferences: true})
})