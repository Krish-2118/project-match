import { Inject, Injectable } from "@nestjs/common";
import type { PrismaClient } from "@repo/database";

type SwipeAction = "LIKE" | "PASS";

@Injectable()
export class SwipesService {
  constructor(@Inject("PRISMA") private readonly prisma: PrismaClient) {}

  async swipeProject(swiperId: string, projectId: string, action: SwipeAction) {
    await this.prisma.swipe.upsert({
      where: {
        swiperId_projectId: {
          swiperId,
          projectId,
        },
      },
      update: { action },
      create: {
        swiperId,
        projectId,
        action,
      },
    });

    return { success: true };
  }

  async swipeUser(swiperId: string, swipedId: string, action: SwipeAction) {
    await this.prisma.userSwipe.upsert({
      where: {
        swiperId_swipedId: {
          swiperId,
          swipedId,
        },
      },
      update: { action },
      create: {
        swiperId,
        swipedId,
        action,
      },
    });

    // Check for mutual match
    if (action === "LIKE") {
      const mutualSwipe = await this.prisma.userSwipe.findUnique({
        where: {
          swiperId_swipedId: {
            swiperId: swipedId,
            swipedId: swiperId,
          },
        },
      });

      if (mutualSwipe && mutualSwipe.action === "LIKE") {
        return { isMatch: true, swipedId };
      }
    }

    return { isMatch: false };
  }

  async unmatchUser(userId: string, targetUserId: string) {
    // Remove both directions of the swipe
    await this.prisma.userSwipe.deleteMany({
      where: {
        OR: [
          { swiperId: userId, swipedId: targetUserId },
          { swiperId: targetUserId, swipedId: userId },
        ],
      },
    });

    return { success: true };
  }

  async getMatches(userId: string) {
    // Find users where both have liked each other
    const myLikes = await this.prisma.userSwipe.findMany({
      where: { swiperId: userId, action: "LIKE" },
      select: { swipedId: true },
    });

    const likedUserIds = myLikes.map((l) => l.swipedId);

    const mutualMatches = await this.prisma.userSwipe.findMany({
      where: {
        swiperId: { in: likedUserIds },
        swipedId: userId,
        action: "LIKE",
      },
      include: {
        swiper: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
            skills: true,
          },
        },
      },
    });

    return mutualMatches.map((m) => m.swiper);
  }

  async getProjectLikes(userId: string) {
    return this.prisma.swipe.findMany({
      where: { swiperId: userId, action: "LIKE" },
      include: {
        project: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });
  }
}
