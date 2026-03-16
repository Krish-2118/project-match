import { auth } from "@/lib/auth";
import { isAblyConfigured } from "@/lib/ably";
import { listConversationSummaries } from "@/lib/chat";
import prisma from "@/lib/prisma";
import type { ProjectFeedItem } from "@/lib/project-types";
import MainApp from "./components/MainApp";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const initialTab = resolvedSearchParams?.tab ?? "projects";
  const session = await auth();

  if (!session?.user) {
    redirect("/landing");
  }

  const userId = session?.user?.id;

  const projectFeed = await prisma.project.findMany({
    where: {
      ownerId: { not: userId }, // Don't show own projects
    },
    include: {
      owner: { select: { name: true } },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 12,
  });
  const projects: ProjectFeedItem[] = projectFeed.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    imageUrl: project.imageUrl,
    tags: project.tags,
    createdAt: project.createdAt.toISOString(),
    commentsCount: project._count.comments,
    owner: {
      name: project.owner.name,
    },
  }));

  // Fetch potential teammates (users the user hasn't swiped on yet)
  const swipedUserIds = await prisma.userSwipe
    .findMany({ where: { swiperId: userId }, select: { swipedId: true } })
    .then((swipes) => swipes.map((s) => s.swipedId));

  const teammates = await prisma.user.findMany({
    where: {
      id: { notIn: [...swipedUserIds, userId!] },
    },
    take: 10,
  });
  const userProfile = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userProfile) {
    redirect("/landing");
  }

  const myProjects = await prisma.project.findMany({
    where: { ownerId: userId },
    include: {
      owner: { select: { name: true } },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch MATCHES (Mutual Likes)
  // 1. Get IDs of users I liked
  const myLikes = await prisma.userSwipe.findMany({
    where: { swiperId: userId, action: "LIKE" },
    select: { swipedId: true },
  });
  const myLikedIds = myLikes.map((l) => l.swipedId);

  // 2. Find which of THEY also liked ME
  const mutualSwipes = await prisma.userSwipe.findMany({
    where: {
      swiperId: { in: myLikedIds },
      swipedId: userId,
      action: "LIKE",
    },
    select: { swiperId: true },
  });
  const matchedUserIds = mutualSwipes.map((s) => s.swiperId);

  const matches = await prisma.user.findMany({
    where: { id: { in: matchedUserIds } },
  });
  const initialConversations = await listConversationSummaries(userId!);
  const realtimeConfigured = isAblyConfigured();

  return (
    <MainApp
      projects={projects}
      teammates={teammates}
      userProfile={userProfile}
      myProjects={myProjects.map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        imageUrl: project.imageUrl,
        tags: project.tags,
        createdAt: project.createdAt.toISOString(),
        commentsCount: project._count.comments,
        owner: {
          name: project.owner.name,
        },
      }))}
      matches={matches}
      initialConversations={initialConversations}
      realtimeConfigured={realtimeConfigured}
      initialTab={initialTab}
    />
  );
}
