import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { PrismaClient } from "@repo/database";
import type { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class UsersService {
  constructor(@Inject("PRISMA") private readonly prisma: PrismaClient) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async getAllUsers(excludeUserId?: string) {
    return this.prisma.user.findMany({
      where: excludeUserId ? { NOT: { id: excludeUserId } } : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        skills: true,
        major: true,
        university: true,
        year: true,
        github: true,
        website: true,
        banner: true,
      },
    });
  }
}
