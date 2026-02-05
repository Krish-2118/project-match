import prisma from "@/lib/prisma";
import { getIO } from "@/lib/socket";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    let userId: string | null = null;
    try {
      userId = (await auth()).userId;
    } catch {
      userId = null;
    }

    const projectId = (await params).id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { action: rawAction } = body as { action?: unknown };
    const action = rawAction === "SKIP" ? "PASS" : rawAction;

    if (typeof action !== "string" || !["LIKE", "PASS", "SUPERLIKE"].includes(action)) {
      return new NextResponse("Invalid action", { status: 400 });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    // Check if already swiped
    const existingSwipe = await prisma.swipe.findUnique({
      where: {
        swiperId_projectId: {
          swiperId: userId,
          projectId: projectId,
        },
      },
    });

    if (existingSwipe) {
      return new NextResponse("Already swiped", { status: 409 });
    }

    // Create the swipe
    const swipe = await prisma.swipe.create({
      data: {
        swiperId: userId,
        projectId: projectId,
        action,
      },
    });

    if (action === "LIKE" || action === "SUPERLIKE") {
      const io = getIO();
      if (io) {
        io.emit("project:liked", {
          projectId: projectId,
          swiperId: userId,
          action: action,
        });
      }
    }

    return NextResponse.json(swipe);
  } catch (error) {
    console.error("[PROJECT_SWIPE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
