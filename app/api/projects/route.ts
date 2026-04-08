import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const projectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(50, "Title must be less than 50 characters"),
    description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
    imageUrl: z.string().url().optional().or(z.literal("")),
    tags: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user?.id) {
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
            where: { id: session.user.id },
            update: {},
            create: {
                id: session.user.id,
                email: session.user.email || "test@example.com",
                name: session.user.name || "Test User",
            },
        });

        const project = await prisma.project.create({
            data: {
                title,
                description,
                imageUrl,
                tags: Array.isArray(tags) ? tags.join(",") : (tags || ""),
                ownerId: session.user.id,
            },
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error("[PROJECT_JOBS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
