import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import type { ProjectCommentPayload } from "@/lib/project-types";

const projectCommentInclude = {
  author: {
    select: {
      id: true,
      name: true,
      image: true,
      major: true,
      university: true,
    },
  },
} satisfies Prisma.ProjectCommentInclude;

type ProjectCommentWithAuthor = Prisma.ProjectCommentGetPayload<{
  include: typeof projectCommentInclude;
}>;

const serializeProjectComment = (
  comment: ProjectCommentWithAuthor,
): ProjectCommentPayload => ({
  id: comment.id,
  body: comment.body,
  createdAt: comment.createdAt.toISOString(),
  author: {
    id: comment.author.id,
    name: comment.author.name,
    image: comment.author.image,
    major: comment.author.major,
    university: comment.author.university,
  },
});

export const listProjectComments = async (
  projectId: string,
): Promise<ProjectCommentPayload[]> => {
  const comments = await prisma.projectComment.findMany({
    where: {
      projectId,
    },
    include: projectCommentInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments.map(serializeProjectComment);
};

export const createProjectComment = async (
  projectId: string,
  authorId: string,
  body: string,
): Promise<ProjectCommentPayload> => {
  const comment = await prisma.projectComment.create({
    data: {
      body,
      projectId,
      authorId,
    },
    include: projectCommentInclude,
  });

  return serializeProjectComment(comment);
};
