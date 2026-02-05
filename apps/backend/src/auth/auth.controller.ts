import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { ClerkAuthGuard } from "./guards/clerk-auth.guard";

@Controller("auth")
export class AuthController {
  @Get("me")
  @UseGuards(ClerkAuthGuard)
  getProfile(@CurrentUser() user: any) {
    return user;
  }

  @Get("health")
  health() {
    return { status: "ok", service: "auth", authProvider: "clerk" };
  }
}
