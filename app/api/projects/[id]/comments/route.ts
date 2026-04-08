import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  createProjectComment,
  listProjectComments,
} from "@/lib/project-comments";

const commentSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty.")
    .max(600, "Comment must be 600 characters or fewer."),
});

const ensureProjectExists = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      id: true,
    },
  });

  return Boolean(project);
};

const getProjectId = async (paramsPromise: Promise<unknown>) => {
  const params = (await paramsPromise) as { id?: unknown };

  if (typeof params.id !== "string" || !params.id) {
    throw new Error("Invalid project id");
  }

  return params.id;
};

export async function GET(
  _: Request,
  { params }: { params: Promise<unknown> },
) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const id = await getProjectId(params);
  const exists = await ensureProjectExists(id);

  if (!exists) {
    return new NextResponse("Project not found", { status: 404 });
  }

  try {
    const comments = await listProjectComments(id);
    return NextResponse.json({ comments });
  } catch (error) {
    console.error("[PROJECT_COMMENTS_GET]", error);
    return new NextResponse("Failed to load comments", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<unknown> },
) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const id = await getProjectId(params);
  const exists = await ensureProjectExists(id);

  if (!exists) {
    return new NextResponse("Project not found", { status: 404 });
  }

  try {
    const body = await req.json();
    const validation = commentSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(validation.error.issues[0].message, {
        status: 400,
      });
    }

    const comment = await createProjectComment(
      id,
      session.user.id,
      validation.data.body,
    );

    return NextResponse.json({ comment });
  } catch (error) {
    console.error("[PROJECT_COMMENTS_POST]", error);
    return new NextResponse("Failed to post comment", { status: 500 });
  }
}
