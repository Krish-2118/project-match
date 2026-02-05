import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const projectSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be less than 50 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    let user: Awaited<ReturnType<typeof currentUser>> | null = null;
    try {
      user = await currentUser();
    } catch {
      user = null;
    }

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const validation = projectSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(validation.error.issues[0].message, { status: 400 });
    }

    const { title, description, imageUrl, tags } = validation.data;

    // Ensure user exists
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "test@example.com",
        name: user.firstName ? `${user.firstName} ${user.lastName}` : "Test User",
      },
    });

    const project = await prisma.project.create({
      data: {
        title,
        description,
        imageUrl,
        tags: Array.isArray(tags) ? tags.join(",") : tags || "",
        ownerId: user.id,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECT_JOBS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
