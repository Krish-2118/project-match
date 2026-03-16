export interface ChatUserSummary {
  id: string;
  name: string | null;
  image: string | null;
  major: string | null;
  university: string | null;
  github?: string | null;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationSummary {
  id: string;
  directMessageKey: string;
  otherUser: ChatUserSummary;
  lastMessage: ChatMessage | null;
  unreadCount: number;
  lastMessageAt: string | null;
  createdAt: string;
}

export interface ConversationPayload {
  conversationId: string;
}
