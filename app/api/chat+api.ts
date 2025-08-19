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
import { ChatSDKError } from '@/lib/errors';
import { getChatById } from './server';
import { Chat } from '@ai-sdk/react';
import { ChatMessage } from '@/lib/types';
import { createTodoListAi } from '@/lib/ai/tools/task';









export async function POST(req: Request) {
  const { messages, chatId }: { messages: UIMessage[], chatId: string } = await req.json();

  let chat: any;

  try {
    chat = await getChatById({ id: chatId });
  } catch {
    return new ChatSDKError('not_found:chat').toResponse();
  }

  if (!chat) {
    return new ChatSDKError('not_found:chat').toResponse();
  }

  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      goal: createGoalAi,
      todoList: createTodoListAi
    },
    
  });

  const answer = result.toUIMessageStream({});
  
  return result.toUIMessageStreamResponse({
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });




}






