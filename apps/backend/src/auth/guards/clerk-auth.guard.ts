import { type CanActivate, type ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger(ClerkAuthGuard.name);

  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      // Use Clerk's verifyToken or similar logic.
      // Since we're using the SDK, we can manually verify the token from the header.
      // Or rely on a middleware approach. For NestJS guards, manual verification is cleaner without global middleware.

      const token = request.headers.authorization?.split(" ")[1];
      if (!token) {
        return false;
      }

      // Verify token
      // Ideally use clerkClient.verifyToken(token) if available or import verifyToken from sdk
      // Due to SDK import structure:
      const { verifyToken } = await import("@clerk/clerk-sdk-node");

      const claims = await verifyToken(token, {
        secretKey: this.configService.get("CLERK_SECRET_KEY"),
      });

      // Attach user/session info to request
      request.user = {
        id: claims.sub,
        ...claims,
      };

      return true;
    } catch (error) {
      this.logger.error("Clerk auth failed", error);
      return false;
    }
  }
}
