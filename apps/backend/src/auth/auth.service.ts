import { clerkClient } from "@clerk/clerk-sdk-node";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  async getUser(userId: string) {
    try {
      return await clerkClient.users.getUser(userId);
    } catch (error) {
      this.logger.error(`Failed to fetch user ${userId} from Clerk`, error);
      throw error;
    }
  }
}
