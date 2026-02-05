import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import MainApp from "./components/MainApp";

export const dynamic = "force-dynamic";

export default async function Home() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;
  const clerkEnabled = Boolean(
    publishableKey && secretKey && !publishableKey.includes("...") && !secretKey.includes("..."),
  );

  let userId = "test-user-id";
  let email = "test@example.com";
  let name = "Test User";
  let imageUrl: string | null = null;

  if (clerkEnabled) {
    let user: Awaited<ReturnType<typeof currentUser>> | null = null;
    try {
      user = await currentUser();
    } catch {
      user = null;
    }

    if (!user) {
      redirect("/landing");
    }

    userId = user.id;
    email = user.emailAddresses[0]?.emailAddress || email;
    name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || name;
    imageUrl = user.imageUrl || null;
  }

  // Sync user to DB if not exists (Basic sync, ideally use webhooks)
  await prisma.user.upsert({
    where: { id: userId },
    update: {
      name,
      email,
      image: imageUrl,
    },
    create: {
      id: userId,
      name,
      email,
      image: imageUrl,
    },
  });

  // Fetch projects the user hasn't swiped on yet
  const swipedProjectIds = await prisma.swipe
    .findMany({ where: { swiperId: userId }, select: { projectId: true } })
    .then((swipes) => swipes.map((s) => s.projectId));

  const projects = await prisma.project.findMany({
    where: {
      id: { notIn: swipedProjectIds },
      ownerId: { not: userId }, // Don't show own projects
    },
    include: { owner: { select: { name: true } } },
    take: 10,
  });

  // Fetch potential teammates (users the user hasn't swiped on yet)
  const swipedUserIds = await prisma.userSwipe
    .findMany({ where: { swiperId: userId }, select: { swipedId: true } })
    .then((swipes) => swipes.map((s) => s.swipedId));

  const teammates = await prisma.user.findMany({
    where: {
      id: { notIn: [...swipedUserIds, userId] },
    },
    take: 10,
  });

  const userProfile = await prisma.user.findUnique({
    where: { id: userId },
  });

  const myProjects = await prisma.project.findMany({
    where: { ownerId: userId },
    include: { owner: { select: { name: true } } },
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

  return (
    <MainApp
      projects={projects}
      teammates={teammates}
      userProfile={
        userProfile || {
          id: userId,
          name: "",
          bio: "",
          skills: "",
          major: "",
          university: "",
          year: "",
          image: null,
          email: null,
        }
      }
      myProjects={myProjects}
      matches={matches}
    />
  );
}
