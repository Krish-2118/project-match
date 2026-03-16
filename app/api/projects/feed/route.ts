import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();

        if (!session || !session.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const projects = await prisma.project.findMany({
            where: {
                ownerId: {
                    not: session.user.id,
                },
            },
            include: {
                owner: {
                    select: {
                        name: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                    },
                },
            },
            take: 12,
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json(
            projects.map((project) => ({
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
            })),
        );
    } catch (error) {
        console.error("[PROJECTS_FEED_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
