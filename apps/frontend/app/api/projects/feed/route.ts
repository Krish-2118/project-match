import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    let userId: string | null = null;
    try {
      userId = (await auth()).userId;
    } catch {
      userId = null;
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get IDs of projects the user has already swiped on
    const swipedProjects = await prisma.swipe.findMany({
      where: {
        swiperId: userId,
      },
      select: {
        projectId: true,
      },
    });

    const swipedProjectIds = swipedProjects.map((swipe: { projectId: string }) => swipe.projectId);

    // Fetch projects that are NOT in the swiped list and NOT owned by the user
    // Limit to 10 for the feed
    const projects = await prisma.project.findMany({
      where: {
        AND: [
          {
            id: {
              notIn: swipedProjectIds,
            },
          },
          // {
          //     ownerId: {
          //         not: session.user.id,
          //     },
          // },
        ],
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("[PROJECTS_FEED_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
