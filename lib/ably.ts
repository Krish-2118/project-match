import Ably from "ably";
import { getConversationChannelName, getUserInboxChannelName } from "@/lib/chat-channels";
import type { ChatMessage } from "@/lib/chat-types";

let restClient: Ably.Rest | null = null;

export const isAblyConfigured = () => Boolean(process.env.ABLY_API_KEY);

const getAblyApiKey = () => {
  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) {
    throw new Error("Missing required environment variable: ABLY_API_KEY");
  }
  return apiKey;
};

export const getAblyRestClient = () => {
  if (!restClient) {
    restClient = new Ably.Rest({
      key: getAblyApiKey(),
      queryTime: true,
    });
  }

  return restClient;
};

export const createAblyTokenRequest = async (clientId: string) => {
  return getAblyRestClient().auth.createTokenRequest({ clientId });
};

export const publishMessageCreated = async (
  message: ChatMessage,
  participantIds: string[],
) => {
  if (!isAblyConfigured()) {
    return;
  }

  const ably = getAblyRestClient();

  await Promise.all([
    ably.channels
      .get(getConversationChannelName(message.conversationId))
      .publish("message.created", message),
    ...participantIds.map((participantId) =>
      ably.channels
        .get(getUserInboxChannelName(participantId))
        .publish("conversation.updated", {
          conversationId: message.conversationId,
        }),
    ),
  ]);
};
