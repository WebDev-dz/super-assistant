import db from '@/db';
import { AppSchema } from '@/instant.schema';
import { UpdateParams } from '@instantdb/react';
import z, { object } from 'zod';
import { PartialDeep } from '../types';
import { ChatSchema, CreateChatSchema } from '../validations';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

export type ChatsHandlers = {
    handleCreateChat: (chat: z.infer<typeof CreateChatSchema>) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
    handleUpdateChat: (chat: UpdateParams<AppSchema, "chat">) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
    handleDeleteChat: (chatId: string) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
    handleDeleteBulkChats: (chatIds: string[]) => Promise<{
        success: () => void;
        error: (error: any) => void;
    }>;
}

const handleCreateChat = async (chat: z.infer<typeof CreateChatSchema>) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Chat Created",
                "text2": `Successfully created: ${chat.title || 'New Chat'}`,
            });
            router.push(`/chat/details/${chat.id}`);
        },
        error: (error: any) => {
            console.error('Error creating chat:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Creating Chat",
                "text2": error?.message || 'Failed to create chat',
            });
        }
    };
}

const handleUpdateChat = async (chat: UpdateParams<AppSchema, "chat">) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Chat Updated",
                "text2": `Successfully updated: ${chat.title || 'Chat'}`,
            });
        },
        error: (error: any) => {
            console.error('Error updating chat:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Updating Chat",
                "text2": error?.message || 'Failed to update chat',
            });
        }
    };
}

const handleDeleteChat = async (chatId: string) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Chat Deleted",
                "text2": "Chat successfully removed",
            });
        },
        error: (error: any) => {
            console.error('Error deleting chat:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Deleting Chat",
                "text2": error?.message || 'Failed to delete chat',
            });
        }
    };
}

const handleDeleteBulkChats = async (chatIds: string[]) => {
    return {
        success: () => {
            Toast.show({
                "type": "success",
                "text1": "Chats Deleted",
                "text2": `Successfully removed ${chatIds.length} chats`,
            });
        },
        error: (error: any) => {
            console.error('Error deleting bulk chats:', error);
            Toast.show({
                "type": "error",
                "text1": "Error Deleting Chats",
                "text2": error?.message || 'Failed to delete chats',
            });
        }
    };
}

export const chatsHandlers: ChatsHandlers = {
    handleCreateChat,
    handleUpdateChat,
    handleDeleteChat,
    handleDeleteBulkChats
};