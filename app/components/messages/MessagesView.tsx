"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Ably, { type InboundMessage } from "ably";
import {
  ArrowLeft,
  Github,
  MessageSquare,
  RefreshCw,
  SendHorizontal,
  Sparkles,
} from "lucide-react";
import { getConversationChannelName, getUserInboxChannelName } from "@/lib/chat-channels";
import type {
  ChatMessage,
  ChatUserSummary,
  ConversationSummary,
} from "@/lib/chat-types";

type MessagesViewProps = {
  currentUserId: string;
  matches: ChatUserSummary[];
  initialConversations: ConversationSummary[];
  realtimeConfigured: boolean;
  onUnreadCountChange: (count: number) => void;
};

const formatTimestamp = (value: string | null) => {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const sortConversations = (items: ConversationSummary[]) =>
  [...items].sort((left, right) => {
    const leftDate = left.lastMessageAt ?? left.createdAt;
    const rightDate = right.lastMessageAt ?? right.createdAt;
    return new Date(rightDate).getTime() - new Date(leftDate).getTime();
  });

const dedupeMessages = (messages: ChatMessage[]) => {
  const seen = new Set<string>();

  return messages.filter((message) => {
    if (seen.has(message.id)) {
      return false;
    }

    seen.add(message.id);
    return true;
  });
};

const isIgnorableRealtimeShutdownError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return false;
  }

  return /connection closed/i.test(error.message);
};

export default function MessagesView({
  currentUserId,
  matches,
  initialConversations,
  realtimeConfigured,
  onUnreadCountChange,
}: MessagesViewProps) {
  const [conversations, setConversations] = useState(() =>
    sortConversations(initialConversations),
  );
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    initialConversations[0]?.id ?? null,
  );
  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, ChatMessage[]>
  >({});
  const [threadOpenOnMobile, setThreadOpenOnMobile] = useState(false);
  const [composer, setComposer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialSyncing, setIsInitialSyncing] = useState(
    initialConversations.length === 0,
  );
  const [loadingConversationId, setLoadingConversationId] = useState<
    string | null
  >(null);
  const [sending, setSending] = useState(false);
  const [startingConversationForUserId, setStartingConversationForUserId] =
    useState<string | null>(null);
  const clientRef = useRef<Ably.Realtime | null>(null);
  const threadBottomRef = useRef<HTMLDivElement>(null);
  const activeConversationIdRef = useRef(activeConversationId);

  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  const totalUnreadCount = useMemo(
    () =>
      conversations.reduce(
        (count, conversation) => count + conversation.unreadCount,
        0,
      ),
    [conversations],
  );

  const activeConversation = useMemo(
    () =>
      conversations.find((conversation) => conversation.id === activeConversationId) ??
      null,
    [activeConversationId, conversations],
  );

  const activeMessages = useMemo(
    () =>
      activeConversationId ? messagesByConversation[activeConversationId] ?? [] : [],
    [activeConversationId, messagesByConversation],
  );

  const startedConversationUserIds = useMemo(
    () => new Set(conversations.map((conversation) => conversation.otherUser.id)),
    [conversations],
  );

  const availableMatches = useMemo(
    () =>
      matches.filter((match) => !startedConversationUserIds.has(match.id)),
    [matches, startedConversationUserIds],
  );

  const upsertConversation = useCallback((incoming: ConversationSummary) => {
    setConversations((current) => {
      const next = current.some((conversation) => conversation.id === incoming.id)
        ? current.map((conversation) =>
            conversation.id === incoming.id ? incoming : conversation,
          )
        : [incoming, ...current];

      return sortConversations(next);
    });
  }, []);

  const upsertMessage = useCallback((conversationId: string, message: ChatMessage) => {
    setMessagesByConversation((current) => {
      const existing = current[conversationId] ?? [];
      return {
        ...current,
        [conversationId]: dedupeMessages([...existing, message]).sort(
          (left, right) =>
            new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
        ),
      };
    });
  }, []);

  const refreshConversations = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      if (!silent) {
        setIsRefreshing(true);
      }

      try {
        const response = await fetch("/api/messages/conversations", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = (await response.json()) as {
          conversations: ConversationSummary[];
        };
        const nextConversations = sortConversations(data.conversations);
        const currentConversationId = activeConversationIdRef.current;

        setConversations(nextConversations);

        if (
          !currentConversationId ||
          !nextConversations.some(
            (conversation) => conversation.id === currentConversationId,
          )
        ) {
          setActiveConversationId(nextConversations[0]?.id ?? null);
          setThreadOpenOnMobile(false);
        }
      } catch (refreshError) {
        console.error(refreshError);
        setError("Failed to refresh conversations.");
      } finally {
        setIsRefreshing(false);
        setIsInitialSyncing(false);
      }
    },
    [],
  );

  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      await fetch(`/api/messages/conversations/${conversationId}/read`, {
        method: "POST",
      });

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationId
            ? { ...conversation, unreadCount: 0 }
            : conversation,
        ),
      );
    } catch (markError) {
      console.error(markError);
    }
  }, []);

  const loadMessages = useCallback(
    async (conversationId: string, shouldMarkRead: boolean) => {
      setLoadingConversationId(conversationId);

      try {
        const response = await fetch(
          `/api/messages/conversations/${conversationId}/messages`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = (await response.json()) as { messages: ChatMessage[] };

        setMessagesByConversation((current) => ({
          ...current,
          [conversationId]: data.messages,
        }));

        if (shouldMarkRead) {
          void markAsRead(conversationId);
        }
      } catch (loadError) {
        console.error(loadError);
        setError("Failed to load messages.");
      } finally {
        setLoadingConversationId(null);
      }
    },
    [markAsRead],
  );

  const handleSelectConversation = async (conversationId: string) => {
    setError(null);
    setActiveConversationId(conversationId);
    setThreadOpenOnMobile(true);
    await loadMessages(conversationId, true);
  };

  const handleStartConversation = async (match: ChatUserSummary) => {
    setStartingConversationForUserId(match.id);
    setError(null);

    try {
      const response = await fetch("/api/messages/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otherUserId: match.id }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = (await response.json()) as {
        conversation: ConversationSummary;
      };

      upsertConversation(data.conversation);
      setActiveConversationId(data.conversation.id);
      setThreadOpenOnMobile(true);
      await loadMessages(data.conversation.id, true);
    } catch (startError) {
      console.error(startError);
      setError(
        startError instanceof Error
          ? startError.message
          : "Failed to start conversation.",
      );
    } finally {
      setStartingConversationForUserId(null);
    }
  };

  const handleSend = async () => {
    if (!activeConversationId || sending) {
      return;
    }

    const nextBody = composer.trim();

    if (!nextBody) {
      return;
    }

    setSending(true);
    setError(null);
    setComposer("");

    try {
      const response = await fetch(
        `/api/messages/conversations/${activeConversationId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body: nextBody }),
        },
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = (await response.json()) as { message: ChatMessage };
      upsertMessage(activeConversationId, data.message);

      setConversations((current) =>
        sortConversations(
          current.map((conversation) =>
            conversation.id === activeConversationId
              ? {
                  ...conversation,
                  lastMessage: data.message,
                  lastMessageAt: data.message.createdAt,
                  unreadCount: 0,
                }
              : conversation,
          ),
        ),
      );
    } catch (sendError) {
      console.error(sendError);
      setComposer(nextBody);
      setError(
        sendError instanceof Error ? sendError.message : "Failed to send message.",
      );
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    onUnreadCountChange(totalUnreadCount);
  }, [onUnreadCountChange, totalUnreadCount]);

  useEffect(() => {
    void refreshConversations({ silent: initialConversations.length > 0 });
  }, [initialConversations.length, refreshConversations]);

  useEffect(() => {
    if (!activeConversationId) {
      return;
    }

    if (!messagesByConversation[activeConversationId]) {
      void loadMessages(activeConversationId, true);
    }
  }, [activeConversationId, loadMessages, messagesByConversation]);

  useEffect(() => {
    threadBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  useEffect(() => {
    if (!realtimeConfigured) {
      return;
    }

    let isDisposed = false;
    const client = new Ably.Realtime({
      authUrl: "/api/ably/token",
      clientId: currentUserId,
      echoMessages: false,
    });

    clientRef.current = client;

    const inboxChannel = client.channels.get(getUserInboxChannelName(currentUserId));
    const handleConversationUpdated = () => {
      void refreshConversations();
    };

    void inboxChannel
      .subscribe("conversation.updated", handleConversationUpdated)
      .catch((subscribeError) => {
        if (isDisposed && isIgnorableRealtimeShutdownError(subscribeError)) {
          return;
        }

        console.error(subscribeError);
      });

    return () => {
      isDisposed = true;
      inboxChannel.unsubscribe("conversation.updated", handleConversationUpdated);
      clientRef.current = null;

      try {
        client.close();
      } catch (closeError) {
        if (!isIgnorableRealtimeShutdownError(closeError)) {
          console.error(closeError);
        }
      }
    };
  }, [currentUserId, realtimeConfigured, refreshConversations]);

  useEffect(() => {
    if (!realtimeConfigured || !activeConversationId || !clientRef.current) {
      return;
    }

    let isDisposed = false;
    const channel = clientRef.current.channels.get(
      getConversationChannelName(activeConversationId),
    );

    const handleMessageCreated = (ablyMessage: InboundMessage) => {
      const incomingMessage = ablyMessage.data as ChatMessage | undefined;
      if (!incomingMessage) {
        return;
      }

      upsertMessage(activeConversationId, incomingMessage);

      setConversations((current) =>
        sortConversations(
          current.map((conversation) =>
            conversation.id === activeConversationId
              ? {
                  ...conversation,
                  lastMessage: incomingMessage,
                  lastMessageAt: incomingMessage.createdAt,
                  unreadCount:
                    incomingMessage.senderId === currentUserId
                      ? 0
                      : conversation.unreadCount,
                }
              : conversation,
          ),
        ),
      );

      if (incomingMessage.senderId !== currentUserId) {
        void markAsRead(activeConversationId);
      }
    };

    void channel.subscribe("message.created", handleMessageCreated).catch(
      (subscribeError) => {
        if (isDisposed && isIgnorableRealtimeShutdownError(subscribeError)) {
          return;
        }

        console.error(subscribeError);
      },
    );

    return () => {
      isDisposed = true;
      channel.unsubscribe("message.created", handleMessageCreated);
    };
  }, [
    activeConversationId,
    currentUserId,
    markAsRead,
    realtimeConfigured,
    upsertMessage,
  ]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void refreshConversations();
      if (activeConversationId) {
        void loadMessages(activeConversationId, false);
      }
    }, realtimeConfigured ? 30000 : 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [activeConversationId, loadMessages, realtimeConfigured, refreshConversations]);

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
      <section
        className={`${threadOpenOnMobile ? "hidden lg:flex" : "flex"} glass-morphism h-[68vh] min-h-[32rem] max-h-[calc(100dvh-10rem)] min-w-0 flex-col rounded-[2rem] border border-white/10`}
      >
        <div className="border-b border-white/10 px-5 py-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-gray-500">
                Inbox
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                Messages
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Chat with people you matched with.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void refreshConversations()}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-gray-300 transition-colors hover:text-white"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-gray-400">
            {realtimeConfigured
              ? "Realtime is active. New messages appear instantly."
              : "Realtime is not configured yet. Messages still work, but the thread refreshes by polling."}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 pr-2 sm:px-4 sm:pr-3">
          <div className="space-y-2">
            {conversations.length > 0 ? (
              conversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId;

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => void handleSelectConversation(conversation.id)}
                    className={`w-full rounded-[1.4rem] border p-3 text-left transition-all ${
                      isActive
                        ? "border-primary/40 bg-primary/10 shadow-[0_18px_45px_rgba(234,40,30,0.12)]"
                        : "border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-black">
                        {conversation.otherUser.image ? (
                          <Image
                            src={conversation.otherUser.image}
                            alt={conversation.otherUser.name || "User"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-lg font-black text-white/20">
                            {(conversation.otherUser.name || "?").slice(0, 1)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-black text-white">
                            {conversation.otherUser.name || "Unnamed Match"}
                          </p>
                          <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
                            {formatTimestamp(
                              conversation.lastMessageAt ?? conversation.createdAt,
                            )}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-400">
                          {conversation.lastMessage?.body || "No messages yet"}
                        </p>
                      </div>
                    </div>

                    {conversation.unreadCount > 0 ? (
                      <div className="mt-3 flex justify-end">
                        <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-2 py-1 text-[10px] font-black text-white">
                          {conversation.unreadCount}
                        </span>
                      </div>
                    ) : null}
                  </button>
                );
              })
            ) : isInitialSyncing ? (
              <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.02] px-5 py-8 text-center">
                <RefreshCw className="mx-auto h-10 w-10 animate-spin text-white/20" />
                <p className="mt-4 text-sm font-bold text-white">
                  Loading conversations...
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Syncing your latest chats.
                </p>
              </div>
            ) : (
              <div className="rounded-[1.6rem] border border-dashed border-white/10 bg-white/[0.02] px-5 py-8 text-center">
                <MessageSquare className="mx-auto h-10 w-10 text-white/20" />
                <p className="mt-4 text-sm font-bold text-white">
                  No conversations yet
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Start a chat with one of your matches below.
                </p>
              </div>
            )}
          </div>

          {availableMatches.length > 0 ? (
            <div className="mt-6 border-t border-white/10 pt-6">
              <div className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-gray-500">
                <Sparkles className="h-4 w-4 text-primary" />
                Start From Matches
              </div>
              <div className="space-y-2">
                {availableMatches.map((match) => (
                  <button
                    key={match.id}
                    type="button"
                    onClick={() => void handleStartConversation(match)}
                    disabled={startingConversationForUserId === match.id}
                    className="flex w-full items-center gap-3 rounded-[1.2rem] border border-white/8 bg-white/[0.03] px-3 py-3 text-left transition-all hover:border-white/15 hover:bg-white/[0.05] disabled:opacity-60"
                  >
                    <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-white/10 bg-black">
                      {match.image ? (
                        <Image
                          src={match.image}
                          alt={match.name || "Match"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg font-black text-white/20">
                          {(match.name || "?").slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-white">
                        {match.name || "Unnamed Match"}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {[match.major, match.university].filter(Boolean).join(" / ") ||
                          "Open a direct message"}
                      </p>
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">
                      {startingConversationForUserId === match.id
                        ? "Opening"
                        : "Chat"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section
        className={`${threadOpenOnMobile ? "flex" : "hidden lg:flex"} glass-morphism h-[68vh] min-h-[32rem] max-h-[calc(100dvh-10rem)] min-w-0 flex-col rounded-[2rem] border border-white/10`}
      >
        {activeConversation ? (
          <>
            <div className="border-b border-white/10 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setThreadOpenOnMobile(false)}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-gray-300 transition-colors hover:text-white lg:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-black">
                  {activeConversation.otherUser.image ? (
                    <Image
                      src={activeConversation.otherUser.image}
                      alt={activeConversation.otherUser.name || "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-black text-white/20">
                      {(activeConversation.otherUser.name || "?").slice(0, 1)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-black text-white">
                    {activeConversation.otherUser.name || "Unnamed Match"}
                  </p>
                  <p className="truncate text-sm text-gray-400">
                    {[
                      activeConversation.otherUser.major,
                      activeConversation.otherUser.university,
                    ]
                      .filter(Boolean)
                      .join(" / ") || "Direct conversation"}
                  </p>
                </div>
                {activeConversation.otherUser.github ? (
                  <a
                    href={activeConversation.otherUser.github}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-gray-300 transition-colors hover:text-white"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 pr-2 sm:px-6 sm:pr-4">
              {loadingConversationId === activeConversation.id ? (
                <div className="flex h-full items-center justify-center text-sm font-bold text-gray-500">
                  Loading messages...
                </div>
              ) : activeMessages.length > 0 ? (
                <div className="space-y-3">
                  {activeMessages.map((message) => {
                    const isMine = message.senderId === currentUserId;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isMine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[82%] rounded-[1.6rem] px-4 py-3 shadow-lg ${
                            isMine
                              ? "bg-primary text-white"
                              : "border border-white/10 bg-white/[0.04] text-gray-100"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                            {message.body}
                          </p>
                          <p
                            className={`mt-2 text-[10px] font-bold uppercase tracking-[0.2em] ${
                              isMine ? "text-white/70" : "text-gray-500"
                            }`}
                          >
                            {formatTimestamp(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={threadBottomRef} />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="max-w-sm text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-white/20" />
                    <p className="mt-4 text-lg font-black text-white">
                      No messages yet
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Say hello and start the conversation.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-4 sm:p-5">
              {error ? (
                <div className="mb-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              ) : null}
              <div className="flex items-end gap-3">
                <textarea
                  value={composer}
                  onChange={(event) => setComposer(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void handleSend();
                    }
                  }}
                  rows={1}
                  className="min-h-[3.25rem] max-h-36 flex-1 resize-none overflow-y-auto rounded-[1.4rem] border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-primary/40"
                  placeholder="Write a message..."
                />
                <button
                  type="button"
                  onClick={() => void handleSend()}
                  disabled={sending || !composer.trim()}
                  className="inline-flex h-13 w-13 items-center justify-center rounded-[1.4rem] border border-primary/45 bg-linear-to-r from-zinc-950 via-neutral-900 to-zinc-950 text-white transition-all hover:border-primary/70 hover:shadow-[0_12px_30px_rgba(234,40,30,0.28)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <SendHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full min-h-[68vh] items-center justify-center p-6">
            <div className="max-w-md text-center">
              <MessageSquare className="mx-auto h-14 w-14 text-white/20" />
              <h2 className="mt-5 text-2xl font-black text-white">
                Select a conversation
              </h2>
              <p className="mt-3 text-sm text-gray-500">
                Pick an existing thread or start a new chat with one of your
                matches.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
