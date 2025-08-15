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
  }}});

  

  return result.toUIMessageStreamResponse({
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });
}