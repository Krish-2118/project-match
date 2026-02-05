import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { ClerkAuthGuard } from "../auth/guards/clerk-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(ClerkAuthGuard)
  async getAllUsers(@CurrentUser() user: any) {
    return this.usersService.getAllUsers(user?.id);
  }

  @Get("me")
  @UseGuards(ClerkAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Patch("me")
  @UseGuards(ClerkAuthGuard)
  async updateProfile(@CurrentUser() user: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @Get(":id")
  async getUserById(@Param("id") id: string) {
    return this.usersService.findById(id);
  }
}
