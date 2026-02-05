import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { PrismaClient } from "@repo/database";
import type { CreateProjectDto } from "./dto/create-project.dto";

@Injectable()
export class ProjectsService {
  constructor(@Inject("PRISMA") private readonly prisma: PrismaClient) {}

  async create(ownerId: string, data: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        ...data,
        ownerId,
      },
    });
  }

  async findAll(excludeOwnerId?: string) {
    return this.prisma.project.findMany({
      where: excludeOwnerId ? { NOT: { ownerId: excludeOwnerId } } : undefined,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
    });
    if (!project) {
      throw new NotFoundException("Project not found");
    }
    return project;
  }

  async findByOwner(ownerId: string) {
    return this.prisma.project.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getFeed(userId: string) {
    // Get projects user hasn't swiped on yet
    const swipedProjectIds = await this.prisma.swipe.findMany({
      where: { swiperId: userId },
      select: { projectId: true },
    });

    const excludeIds = swipedProjectIds.map((s) => s.projectId);

    return this.prisma.project.findMany({
      where: {
        NOT: {
          OR: [{ ownerId: userId }, { id: { in: excludeIds } }],
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
