"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  MessageSquareText,
  SendHorizontal,
  Tag,
  UserRound,
  X,
} from "lucide-react";
import type {
  ProjectCommentPayload,
  ProjectFeedItem,
} from "@/lib/project-types";

const fallbackImage =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1400";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export default function ProjectDetailsModal({
  project,
  onClose,
  onCommentCreated,
}: {
  project: ProjectFeedItem | null;
  onClose: () => void;
  onCommentCreated: (projectId: string, comment: ProjectCommentPayload) => void;
}) {
  const [comments, setComments] = useState<ProjectCommentPayload[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!project) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [project]);

  useEffect(() => {
    if (!project) {
      setComments([]);
      setCommentBody("");
      setError(null);
      return;
    }

    const controller = new AbortController();

    const loadComments = async () => {
      setIsLoadingComments(true);
      setError(null);

      try {
        const response = await fetch(`/api/projects/${project.id}/comments`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = (await response.json()) as {
          comments: ProjectCommentPayload[];
        };
        setComments(data.comments);
      } catch (loadError) {
        if (controller.signal.aborted) {
          return;
        }

        console.error(loadError);
        setError("Failed to load public comments.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingComments(false);
        }
      }
    };

    void loadComments();

    return () => {
      controller.abort();
    };
  }, [project]);

  if (!project) {
    return null;
  }

  const tags = project.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const handleSubmitComment = async () => {
    const nextBody = commentBody.trim();

    if (!nextBody || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${project.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: nextBody }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = (await response.json()) as {
        comment: ProjectCommentPayload;
      };

      setComments((current) => [data.comment, ...current]);
      setCommentBody("");
      onCommentCreated(project.id, data.comment);
    } catch (submitError) {
      console.error(submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to post comment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/78 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="glass-morphism max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-gray-500">
              Project details
            </p>
            <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-white">
              {project.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-gray-300 transition-colors hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(92vh-5.25rem)] overflow-y-auto">
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.15fr_0.95fr]">
            <div className="space-y-5">
              <div className="relative h-72 overflow-hidden rounded-[1.8rem] border border-white/10 bg-black sm:h-80">
                <Image
                  src={project.imageUrl || fallbackImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-white/80 backdrop-blur">
                    <MessageSquareText className="h-3.5 w-3.5 text-primary" />
                    {project.commentsCount} public comments
                  </div>
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-white/10 bg-black/35 p-5">
                <div className="flex flex-wrap gap-3 text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
                    <UserRound className="h-4 w-4 text-primary" />
                    {project.owner.name || "Anonymous Builder"}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    {formatDate(project.createdAt)}
                  </span>
                </div>

                <p className="mt-5 text-base leading-7 text-gray-200">
                  {project.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {tags.length > 0 ? (
                    tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-gray-200"
                      >
                        <Tag className="h-3.5 w-3.5 text-primary" />
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full border border-dashed border-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
                      No tags added
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex min-h-0 flex-col rounded-[1.8rem] border border-white/10 bg-black/35">
              <div className="border-b border-white/10 px-5 py-4">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-gray-500">
                  Public discussion
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Ask questions, react to the idea, or leave feedback below.
                </p>
              </div>

              <div className="border-b border-white/10 p-4">
                {error ? (
                  <div className="mb-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                ) : null}
                <div className="flex items-end gap-3">
                  <textarea
                    value={commentBody}
                    onChange={(event) => setCommentBody(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void handleSubmitComment();
                      }
                    }}
                    rows={3}
                    className="min-h-[6rem] max-h-36 flex-1 resize-none overflow-y-auto rounded-[1.2rem] border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-primary/40"
                    placeholder="Write a public comment..."
                  />
                  <button
                    type="button"
                    onClick={() => void handleSubmitComment()}
                    disabled={isSubmitting || !commentBody.trim()}
                    className="inline-flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-[1.2rem] border border-primary/45 bg-linear-to-r from-zinc-950 via-neutral-900 to-zinc-950 text-white transition-all hover:border-primary/70 hover:shadow-[0_12px_30px_rgba(234,40,30,0.28)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <SendHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                {isLoadingComments ? (
                  <div className="flex h-full items-center justify-center text-sm font-bold text-gray-500">
                    Loading comments...
                  </div>
                ) : comments.length > 0 ? (
                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black">
                            {comment.author.image ? (
                              <Image
                                src={comment.author.image}
                                alt={comment.author.name || "Comment author"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-sm font-black text-white/30">
                                {(comment.author.name || "?").slice(0, 1)}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate text-sm font-black text-white">
                                {comment.author.name || "Anonymous Builder"}
                              </p>
                              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              {[comment.author.major, comment.author.university]
                                .filter(Boolean)
                                .join(" / ") || "Project Match member"}
                            </p>
                            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-gray-200">
                              {comment.body}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="max-w-xs text-center">
                      <MessageSquareText className="mx-auto h-12 w-12 text-white/20" />
                      <p className="mt-4 text-lg font-black text-white">
                        No public comments yet
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Be the first to react to this project.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
