import type { Prisma, PrismaClient } from "@prisma/client";
import prisma from "@/lib/prisma";
import type { ChatMessage, ChatUserSummary, ConversationSummary } from "@/lib/chat-types";
import {
  decryptMessageBody,
  encryptMessageBody,
} from "@/lib/message-encryption";

const conversationInclude = {
  participants: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          major: true,
          university: true,
          github: true,
        },
      },
    },
  },
  messages: {
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  },
} satisfies Prisma.ConversationInclude;

type ConversationWithRelations = Prisma.ConversationGetPayload<{
  include: typeof conversationInclude;
}>;

type ConversationParticipantWithConversation = Prisma.ConversationParticipantGetPayload<{
  include: {
    conversation: {
      include: {
        participants: true;
      };
    };
  };
}>;

export class ChatError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ChatError";
  }
}

const createDirectMessageKey = (userId: string, otherUserId: string) =>
  [userId, otherUserId].sort().join(":");

const mapChatUserSummary = (user: {
  id: string;
  name: string | null;
  image: string | null;
  major: string | null;
  university: string | null;
  github: string | null;
}): ChatUserSummary => ({
  id: user.id,
  name: user.name,
  image: user.image,
  major: user.major,
  university: user.university,
  github: user.github,
});

const mapChatMessage = (message: {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}): ChatMessage => ({
  id: message.id,
  conversationId: message.conversationId,
  senderId: message.senderId,
  body: decryptMessageBody(message.body),
  createdAt: message.createdAt.toISOString(),
  updatedAt: message.updatedAt.toISOString(),
});

const countUnreadMessages = async (
  db: PrismaClient,
  conversationId: string,
  userId: string,
  lastReadAt: Date | null,
) => {
  return db.message.count({
    where: {
      conversationId,
      senderId: {
        not: userId,
      },
      ...(lastReadAt
        ? {
            createdAt: {
              gt: lastReadAt,
            },
          }
        : {}),
    },
  });
};

const mapConversationSummary = async (
  db: PrismaClient,
  conversation: ConversationWithRelations,
  currentUserId: string,
): Promise<ConversationSummary> => {
  const currentParticipant = conversation.participants.find(
    (participant) => participant.userId === currentUserId,
  );

  if (!currentParticipant) {
    throw new ChatError("Conversation access denied", 403);
  }

  const otherParticipant = conversation.participants.find(
    (participant) => participant.userId !== currentUserId,
  );

  if (!otherParticipant) {
    throw new ChatError("Conversation is missing another participant", 500);
  }

  const unreadCount = await countUnreadMessages(
    db,
    conversation.id,
    currentUserId,
    currentParticipant.lastReadAt,
  );

  return {
    id: conversation.id,
    directMessageKey: conversation.directMessageKey,
    otherUser: mapChatUserSummary(otherParticipant.user),
    lastMessage: conversation.messages[0]
      ? mapChatMessage(conversation.messages[0])
      : null,
    unreadCount,
    lastMessageAt: conversation.lastMessageAt?.toISOString() ?? null,
    createdAt: conversation.createdAt.toISOString(),
  };
};

const getConversationMembership = async (
  userId: string,
  conversationId: string,
): Promise<ConversationParticipantWithConversation> => {
  const membership = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
    include: {
      conversation: {
        include: {
          participants: true,
        },
      },
    },
  });

  if (!membership) {
    throw new ChatError("Conversation not found", 404);
  }

  return membership;
};

const areUsersMatched = async (userId: string, otherUserId: string) => {
  if (userId === otherUserId) {
    return false;
  }

  const [mySwipe, theirSwipe] = await prisma.$transaction([
    prisma.userSwipe.findUnique({
      where: {
        swiperId_swipedId: {
          swiperId: userId,
          swipedId: otherUserId,
        },
      },
      select: {
        action: true,
      },
    }),
    prisma.userSwipe.findUnique({
      where: {
        swiperId_swipedId: {
          swiperId: otherUserId,
          swipedId: userId,
        },
      },
      select: {
        action: true,
      },
    }),
  ]);

  return mySwipe?.action === "LIKE" && theirSwipe?.action === "LIKE";
};

export const listConversationSummaries = async (
  userId: string,
): Promise<ConversationSummary[]> => {
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId,
        },
      },
    },
    include: conversationInclude,
    orderBy: [
      {
        lastMessageAt: "desc",
      },
      {
        updatedAt: "desc",
      },
    ],
  });

  return Promise.all(
    conversations.map((conversation) =>
      mapConversationSummary(prisma, conversation, userId),
    ),
  );
};

export const getOrCreateConversation = async (
  userId: string,
  otherUserId: string,
): Promise<ConversationSummary> => {
  const matched = await areUsersMatched(userId, otherUserId);

  if (!matched) {
    throw new ChatError("Only matched users can start a conversation", 403);
  }

  const directMessageKey = createDirectMessageKey(userId, otherUserId);

  const conversation = await prisma.conversation.upsert({
    where: {
      directMessageKey,
    },
    update: {},
    create: {
      directMessageKey,
      participants: {
        create: [{ userId }, { userId: otherUserId }],
      },
    },
    include: conversationInclude,
  });

  return mapConversationSummary(prisma, conversation, userId);
};

export const listMessagesForConversation = async (
  userId: string,
  conversationId: string,
) => {
  await getConversationMembership(userId, conversationId);

  const messages = await prisma.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 50,
  });

  return messages.map(mapChatMessage);
};

export const markConversationRead = async (
  userId: string,
  conversationId: string,
) => {
  await getConversationMembership(userId, conversationId);

  await prisma.conversationParticipant.update({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
    data: {
      lastReadAt: new Date(),
    },
  });
};

export const sendMessageToConversation = async (
  userId: string,
  conversationId: string,
  body: string,
) => {
  const trimmedBody = body.trim();

  if (!trimmedBody) {
    throw new ChatError("Message cannot be empty", 400);
  }

  if (trimmedBody.length > 2000) {
    throw new ChatError("Message must be 2000 characters or fewer", 400);
  }

  const membership = await getConversationMembership(userId, conversationId);
  const participantIds = membership.conversation.participants.map(
    (participant) => participant.userId,
  );

  const message = await prisma.$transaction(async (tx) => {
    const createdMessage = await tx.message.create({
      data: {
        conversationId,
        senderId: userId,
        body: encryptMessageBody(trimmedBody),
      },
    });

    await tx.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: createdMessage.createdAt,
      },
    });

    await tx.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
      data: {
        lastReadAt: createdMessage.createdAt,
      },
    });

    return createdMessage;
  });

  return {
    message: mapChatMessage(message),
    participantIds,
  };
};
