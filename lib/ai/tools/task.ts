import { TaskSchema } from "@/lib/validations";
import { tool } from "ai";
import z from "zod";
import { zodSchema } from 'ai';







export const createTaskAi = tool({
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