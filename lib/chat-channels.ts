export const getConversationChannelName = (conversationId: string) =>
  `conversation:${conversationId}`;

export const getUserInboxChannelName = (userId: string) =>
  `user:${userId}:inbox`;
