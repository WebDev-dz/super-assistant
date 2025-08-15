import { init, id } from '@instantdb/admin';
import { goalTool } from '@/lib/ai/tools/goal';
import { GoalSchema } from '@/lib/validations';
import { openai } from '@ai-sdk/openai';
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from 'ai';
import { z } from 'zod';





// ID for app: goals-app
const ADMIN_TOKEN = process.env.INSTANT_APP_ADMIN_TOKEN!
const APP_ID = process.env.EXPO_PUBLIC_INSTANT_APP_ID!;

if (!APP_ID || !ADMIN_TOKEN) {
  throw new Error('Missing InstantDB app ID or admin token');
}


export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      goal: goalTool
    },
    "onFinish": (result) => {
      if (result.toolCalls) {
        const toolCall = result.toolCalls.find(call => call.toolName === 'goal');
        if (toolCall) {

        }
      }
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