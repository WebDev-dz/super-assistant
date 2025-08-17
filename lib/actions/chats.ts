import db from '@/db';
import { AppSchema } from '@/instant.schema';
import { id, UpdateParams } from '@instantdb/react';
import z, { object } from 'zod';
import { PartialDeep } from '../types';
import { ChatSchema, CreateChatSchema } from '../validations';
import { deleteQuery, updateQuery } from '../db/queries';
import * as expoCalendar from "expo-calendar"

export type ChatsActions = {
    createChat: (chat: z.infer<typeof CreateChatSchema>) => Promise<any>;
    updateChat: (chat: UpdateParams<AppSchema, "chat">) => Promise<any>;
    deleteChat: (chatId: string) => Promise<void>;
    deleteBulkChats: (chatIds: string[]) => Promise<void>;
}

const createChat = async (chat: z.infer<typeof CreateChatSchema>) => {
    console.log("Creating Chat:", chat);
    const { success, data, error } = CreateChatSchema.safeParse(chat);
    if (!success) {
        throw new Error(`Invalid chat data: ${error.message}`);
    }
    const query = await updateQuery("chat", {
        ...data,
        id: id(),
    });

    const result = await db.transact(query)

    console.log("Chat created:", result);
    return result;
}



const updateChat = async (chat: UpdateParams<AppSchema, "chat">) => {
    console.log("Updating Chat:", chat);

    if (!chat.id) {
        throw new Error("Chat ID is required for update");
    }

    const { success, data, error } = ChatSchema.partial().safeParse(chat);
    if (!success) {
        throw new Error(`Invalid chat data: ${error.message}`);
    }



    // Update in database
    const query = await updateQuery("chat", data);
    const result = await db.transact(query);

    console.log("Chat updated:", result);
    return result;
}

const deleteChat = async (chatId: string) => {
    console.log("Deleting Chat:", chatId);

    if (!chatId) {
        throw new Error("Chat ID is required for deletion");
    }

    try {
        // Delete from expo calendar

        // Delete from database
        const query = await deleteQuery("chat", chatId);
        await db.transact([{ ...query }]);

        console.log("Chat deleted successfully:", chatId);
    } catch (error) {
        console.error("Error deleting chat:", error);
        throw new Error(`Failed to delete chat: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

const deleteBulkChats = async (chatIds: string[]) => {
    console.log("Bulk deleting Chats:", chatIds);

    if (!chatIds || chatIds.length === 0) {
        return;
    }

    try {

        // Delete from database in batch
        const deleteQueries = await Promise.all(
            chatIds.map(async (id) => {
                const query = await updateQuery("chat", { id });
                return { ...query, delete: true };
            })
        );

        await db.transact(deleteQueries);

        console.log("Bulk delete completed successfully:", chatIds);
    } catch (error) {
        console.error("Error in bulk delete:", error);
        throw new Error(`Failed to bulk delete chats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export const chatsActions: ChatsActions = {
    createChat,
    updateChat,
    deleteChat,
    deleteBulkChats
};