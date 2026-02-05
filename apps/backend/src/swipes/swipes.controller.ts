import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ClerkAuthGuard } from "../auth/guards/clerk-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { SwipeProjectDto, SwipeUserDto } from "./dto/swipe.dto";
import { SwipesService } from "./swipes.service";

@Controller("swipes")
@UseGuards(ClerkAuthGuard)
export class SwipesController {
  constructor(private readonly swipesService: SwipesService) {}

  @Post("project")
  async swipeProject(@CurrentUser() user: any, @Body() dto: SwipeProjectDto) {
    return this.swipesService.swipeProject(user.id, dto.projectId, dto.action);
  }

  @Post("user")
  async swipeUser(@CurrentUser() user: any, @Body() dto: SwipeUserDto) {
    return this.swipesService.swipeUser(user.id, dto.userId, dto.action);
  }

  @Delete("user/:targetUserId")
  async unmatchUser(@CurrentUser() user: any, @Param("targetUserId") targetUserId: string) {
    return this.swipesService.unmatchUser(user.id, targetUserId);
  }

  @Get("matches")
  async getMatches(@CurrentUser() user: any) {
    return this.swipesService.getMatches(user.id);
  }

  @Get("likes")
  async getProjectLikes(@CurrentUser() user: any) {
    return this.swipesService.getProjectLikes(user.id);
  }
}
