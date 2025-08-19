import { init, id } from '@instantdb/admin';
import { createGoalAi } from '@/lib/ai/tools/goal';
import { GoalSchema } from '@/lib/validations';
import { zodSchema } from 'ai';

import { openai } from '@ai-sdk/openai';
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from 'ai';
import { z } from 'zod';
import { createTaskAi } from '@/lib/ai/tools/task';
import { createMilestoneAi } from '@/lib/ai/tools/milestone';





// ID for app: goals-app
const ADMIN_TOKEN = process.env.INSTANT_APP_ADMIN_TOKEN!
const APP_ID = process.env.EXPO_PUBLIC_INSTANT_APP_ID!;

if (!APP_ID || !ADMIN_TOKEN) {
  throw new Error('Missing InstantDB app ID or admin token');
}


export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4'),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      todoList: createTaskAi
    }
  });

  return result.toUIMessageStreamResponse({
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });




}






const serverDb = init({
  appId: APP_ID,
  adminToken: ADMIN_TOKEN,
});