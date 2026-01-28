"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function swipeProject(projectId: string, action: "LIKE" | "PASS") {
    const session = await auth();
    const userId = session?.user?.id || "test-user-id";

    await prisma.swipe.upsert({
        where: {
            swiperId_projectId: {
                swiperId: userId,
                projectId: projectId,
            },
        },
        update: { action },
        create: {
            swiperId: userId,
            projectId: projectId,
            action,
        },
    });

    revalidatePath("/");
}

export async function swipeUser(swipedId: string, action: "LIKE" | "PASS") {
    const session = await auth();
    const userId = session?.user?.id || "test-user-id";

    await prisma.userSwipe.upsert({
        where: {
            swiperId_swipedId: {
                swiperId: userId,
                swipedId: swipedId,
            },
        },
        update: { action },
        create: {
            swiperId: userId,
            swipedId: swipedId,
            action,
        },
    });

    if (action === "LIKE") {
        const mutualSwipe = await prisma.userSwipe.findUnique({
            where: {
                swiperId_swipedId: {
                    swiperId: swipedId,
                    swipedId: userId,
                },
            },
        });

        if (mutualSwipe && mutualSwipe.action === "LIKE") {
            revalidatePath("/");
            return { isMatch: true, swipedId };
        }
    }

    revalidatePath("/");
    return { isMatch: false };
}

export async function unmatchUser(targetUserId: string) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { error: "Not authenticated" };

    try {
        // Remove MY swipe on THEM
        await prisma.userSwipe.deleteMany({
            where: {
                swiperId: userId,
                swipedId: targetUserId,
            },
        });

        // Optional: Remove THEIR swipe on ME (true unmatch)
        // Usually dependent on app logic, but for "unmatch" it acts as a block
        await prisma.userSwipe.deleteMany({
            where: {
                swiperId: targetUserId,
                swipedId: userId,
            },
        });

        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Unmatch failed:", error);
        return { error: "Failed to unmatch" };
    }
}
