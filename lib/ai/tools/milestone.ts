import { MilestoneSchema } from "@/lib/validations";
import { tool } from "ai";
import z from "zod";
import { zodSchema } from 'ai';





export const createMilestoneAi = tool({
    description: 'Break down a milestone into actionable steps',
    inputSchema: zodSchema(z.any()),
    
    outputSchema: zodSchema(z.object({
        milestone: MilestoneSchema,
    }), { useReferences: true})
})