import { init, id, TransactionChunk } from "@instantdb/admin";
import { generateHashedPassword } from "@/utils";
import { ChatSDKError } from "@/lib/errors";
import schema from "@/instant.schema";

// ID for app: goals-app
const ADMIN_TOKEN = process.env.INSTANT_APP_ADMIN_TOKEN!;
const APP_ID = process.env.EXPO_PUBLIC_INSTANT_APP_ID!;
const serverDb = init({
  appId: APP_ID,
  adminToken: ADMIN_TOKEN,
//   @ts-ignore
  schema

});

// User functions
export async function getUser(email: string) {
  try {
    const data = await serverDb.query({
      users: {
        $: {
          where: { email },
        },
      },
    });
    return data.users || [];
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get user by email"
    );
  }
}

export async function createUser(email: string, password: string) {
  const hashedPassword = generateHashedPassword(password);
  const userId = id();

  try {
    await serverDb.transact([
      serverDb.tx.users[userId].update({
        email,
        password: hashedPassword,
        createdAt: Date.now(),
      }),
    ]);
    return { id: userId, email };
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to create user");
  }
}

export async function createGuestUser() {
  const email = `guest-${Date.now()}`;
  const password = generateHashedPassword(id());
  const userId = id();

  try {
    await serverDb.transact([
      serverDb.tx.users[userId].update({
        email,
        password,
        createdAt: Date.now(),
      }),
    ]);
    return [{ id: userId, email }];
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to create guest user"
    );
  }
}

// Chat functions
export async function saveChat({
  id: chatId,
  userId,
  title,
  visibility,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: "public" | "private";
}) {
  try {
    await serverDb.transact([
      serverDb.tx.chats[chatId].update({
        userId,
        title,
        visibility,
        createdAt: Date.now(),
      }),
    ]);
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to save chat");
  }
}

export async function deleteChatById({ id: chatId }: { id: string }) {
  try {
    // Get all related data first
    const data = await serverDb.query({
      votes: {
        $: { where: { chatId } },
      },
      messages: {
        $: { where: { chatId } },
      },
      streams: {
        $: { where: { chatId } },
      },
      chats: {
        $: { where: { id: chatId } },
      },
    });

    const chat = data.chats[0];
    if (!chat) {
      throw new ChatSDKError("not_found:database", "Chat not found");
    }

    // Delete all related entities in a single transaction
    const deleteTransactions = [];

    // Delete votes
    data.votes.forEach((vote) => {
      deleteTransactions.push(serverDb.tx.votes[vote.id].delete());
    });

    // Delete messages
    data.messages.forEach((message) => {
      deleteTransactions.push(serverDb.tx.messages[message.id].delete());
    });

    // Delete streams
    data.streams.forEach((stream) => {
      deleteTransactions.push(serverDb.tx.streams[stream.id].delete());
    });

    // Delete the chat itself
    deleteTransactions.push(serverDb.tx.chats[chatId].delete());

    await serverDb.transact(deleteTransactions);
    return chat;
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete chat by id"
    );
  }
}

export async function getChatsByUserId({
  id: userId,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  try {
    let whereCondition: any = { userId };

    // Handle cursor-based pagination
    if (startingAfter) {
      // Get the timestamp of the starting chat
      const startData = await serverDb.query({
        chats: {
          $: { where: { id: startingAfter } },
        },
      });

      if (!startData.chats[0]) {
        throw new ChatSDKError(
          "not_found:database",
          `Chat with id ${startingAfter} not found`
        );
      }

      whereCondition.createdAt = { $gt: startData.chats[0].createdAt };
    } else if (endingBefore) {
      const endData = await serverDb.query({
        chats: {
          $: { where: { id: endingBefore } },
        },
      });

      if (!endData.chats[0]) {
        throw new ChatSDKError(
          "not_found:database",
          `Chat with id ${endingBefore} not found`
        );
      }

      whereCondition.createdAt = { $lt: endData.chats[0].createdAt };
    }

    const data = await serverDb.query({
      chats: {
        $: {
          where: whereCondition,
          order: { createdAt: "desc" },
          limit: limit + 1,
        },
      },
    });

    const chats = data.chats || [];
    const hasMore = chats.length > limit;

    return {
      chats: hasMore ? chats.slice(0, limit) : chats,
      hasMore,
    };
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get chats by user id"
    );
  }
}

export async function getChatById({ id: chatId }: { id: string }) {
  try {
    const data = await serverDb.query({
      chats: {
        $: { where: { id: chatId } },
      },
    });
    return data.chats[0];
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get chat by id");
  }
}

// Message functions
export async function saveMessages({
  messages,
}: {
  messages: Array<any>; // Replace with your DBMessage type
}) {
  try {
    const transactions = messages.map((message) =>
      serverDb.tx.messages[message.id || id()].update({
        ...message,
        createdAt: message.createdAt || Date.now(),
      })
    );
    await serverDb.transact(transactions);
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to save messages");
  }
}

export async function getMessagesByChatId({ id: chatId }: { id: string }) {
  try {
    const data = await serverDb.query({
      messages: {
        $: {
          where: { chatId },
          order: { createdAt: "asc" },
        },
      },
    });
    return data.messages || [];
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get messages by chat id"
    );
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: "up" | "down";
}) {
  try {
    // Check for existing vote
    const data = await serverDb.query({
      votes: {
        $: { where: { messageId } },
      },
    });

    const existingVote = data.votes[0];
    const isUpvoted = type === "up";

    if (existingVote) {
      await serverDb.transact([serverDb.tx.votes[existingVote.id].update({ isUpvoted })]);
    } else {
      const voteId = id();
      await serverDb.transact([
        serverDb.tx.votes[voteId].update({
          chatId,
          messageId,
          isUpvoted,
          createdAt: Date.now(),
        }),
      ]);
    }
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to vote message");
  }
}

export async function getVotesByChatId({ id: chatId }: { id: string }) {
  try {
    const data = await serverDb.query({
      votes: {
        $: { where: { chatId } },
      },
    });
    return data.votes || [];
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get votes by chat id"
    );
  }
}

// Document functions
export async function saveDocument({
  id: documentId,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: string;
  content: string;
  userId: string;
}) {
  try {
    const createdAt = Date.now();
    await serverDb.transact([
      serverDb.tx.documents[documentId].update({
        title,
        kind,
        content,
        userId,
        createdAt,
      }),
    ]);
    return [{ id: documentId, title, kind, content, userId, createdAt }];
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to save document");
  }
}

export async function getDocumentsById({ id: documentId }: { id: string }) {
  try {
    const data = await serverDb.query({
      documents: {
        $: {
          where: { id: documentId },
          order: { createdAt: "asc" },
        },
      },
    });
    return data.documents || [];
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get documents by id"
    );
  }
}

export async function getDocumentById({ id: documentId }: { id: string }) {
  try {
    const data = await serverDb.query({
      documents: {
        $: {
          where: { id: documentId },
          order: { createdAt: "desc" },
          limit: 1,
        },
      },
    });
    return data.documents[0];
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get document by id"
    );
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id: documentId,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    const timestampMs = timestamp.getTime();

    // Get documents and suggestions to delete
    const data = await serverDb.query({
      documents: {
        $: {
          where: {
            id: documentId,
            createdAt: { $gt: timestampMs },
          },
        },
      },
      suggestions: {
        $: {
          where: {
            documentId,
            documentCreatedAt: { $gt: timestampMs },
          },
        },
      },
    });

    const deleteTransactions: TransactionChunk<any, any>[] = [];

    // Delete suggestions first
    data.suggestions.forEach((suggestion) => {
      deleteTransactions.push(serverDb.tx.suggestions[suggestion.id].delete());
    });

    // Delete documents
    data.documents.forEach((doc) => {
      deleteTransactions.push(serverDb.tx.documents[doc.id].delete());
    });

    if (deleteTransactions.length > 0) {
      await serverDb.transact(deleteTransactions);
    }

    return data.documents;
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete documents by id after timestamp"
    );
  }
}

// Suggestion functions
export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<any>; // Replace with your Suggestion type
}) {
  try {
    const transactions = suggestions.map((suggestion) =>
      serverDb.tx.suggestions[suggestion.id || id()].update({
        ...suggestion,
        createdAt: suggestion.createdAt || Date.now(),
      })
    );
    await serverDb.transact(transactions);
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to save suggestions"
    );
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    const data = await serverDb.query({
      suggestions: {
        $: { where: { documentId } },
      },
    });
    return data.suggestions || [];
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get suggestions by document id"
    );
  }
}

export async function getMessageById({ id: messageId }: { id: string }) {
  try {
    const data = await serverDb.query({
      messages: {
        $: { where: { id: messageId } },
      },
    });
    return data.messages || [];
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message by id"
    );
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const timestampMs = timestamp.getTime();

    // Get messages to delete
    const data = await serverDb.query({
      messages: {
        $: {
          where: {
            chatId,
            createdAt: { $gte: timestampMs },
          },
        },
      },
      votes: {
        $: { where: { chatId } },
      },
    });

    const messageIds = data.messages.map((msg) => msg.id);
    const deleteTransactions: TransactionChunk<any, any>[] = [];

    // Delete votes for those messages
    data.votes
      .filter((vote) => messageIds.includes(vote.messageId))
      .forEach((vote) => {
        deleteTransactions.push(serverDb.tx.votes[vote.id].delete());
      });

    // Delete messages
    data.messages.forEach((message) => {
      deleteTransactions.push(serverDb.tx.messages[message.id].delete());
    });

    if (deleteTransactions.length > 0) {
      await serverDb.transact(deleteTransactions);
    }
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete messages by chat id after timestamp"
    );
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: "private" | "public";
}) {
  try {
    await serverDb.transact([serverDb.tx.chats[chatId].update({ visibility })]);
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to update chat visibility by id"
    );
  }
}

export async function getMessageCountByUserId({
  id: userId,
  differenceInHours,
}: {
  id: string;
  differenceInHours: number;
}) {
  try {
    const hoursAgo = Date.now() - differenceInHours * 60 * 60 * 1000;

    const data = await serverDb.query({
      messages: {
        $: {
          where: {
            role: "user",
            createdAt: { $gte: hoursAgo },
          },
        },
      },
      chats: {
        $: {
          where: { userId },
        },
      },
    });

    // Filter messages that belong to the user's chats
    const userChatIds = new Set(data.chats?.map((chat) => chat.id) || []);
    const userMessages = data.messages.filter((msg) =>
      userChatIds.has(msg.chatId)
    );

    return userMessages.length;
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message count by user id"
    );
  }
}

// Stream functions
export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) {
  try {
    await serverDb.transact([
      serverDb.tx.streams[streamId].update({
        chatId,
        createdAt: Date.now(),
      }),
    ]);
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to create stream id"
    );
  }
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  try {
    const data = await serverDb.query({
      streams: {
        $: {
          where: { chatId },
          order: { createdAt: "asc" },
        },
      },
    });

    return (data.streams || []).map((stream) => stream.id);
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get stream ids by chat id"
    );
  }
}

// Auth helper functions using InstantDB's built-in auth
export async function getUserByEmail(email: string) {
  try {
    const user = await serverDb.auth.getUser({ email });
    return user;
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get user by email from auth"
    );
  }
}

export async function createUserWithAuth(email: string) {
  try {
    // InstantDB will create a user automatically when creating a token
    const token = await serverDb.auth.createToken(email);
    return { token, email };
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to create user with auth"
    );
  }
}

export async function deleteUserById(userId: string) {
  try {
    await serverDb.auth.deleteUser({ id: userId });
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to delete user");
  }
}

export async function verifyUserToken(token: string) {
  try {
    const user = await serverDb.auth.verifyToken(token);
    return user;
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to verify token");
  }
}
