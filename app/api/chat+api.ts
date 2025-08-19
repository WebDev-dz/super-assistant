import { init, id } from '@instantdb/admin';
import { GoalSchema } from '@/lib/validations';
import {  } from "@clerk/clerk-expo"
import { openai } from '@ai-sdk/openai';
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from 'ai';
import { z } from 'zod';
import { createGoalAi } from '@/lib/ai/tools/goal';









export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      goal: createGoalAi
    },
    "onFinish": (result) => {
      
    }
  });



  return result.toUIMessageStreamResponse({
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });




}






