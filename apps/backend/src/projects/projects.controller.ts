import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ClerkAuthGuard } from "../auth/guards/clerk-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { CreateProjectDto } from "./dto/create-project.dto";
import { ProjectsService } from "./projects.service";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  async create(@CurrentUser() user: any, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(user.id, createProjectDto);
  }

  @Get()
  async findAll() {
    return this.projectsService.findAll();
  }

  @Get("feed")
  @UseGuards(ClerkAuthGuard)
  async getFeed(@CurrentUser() user: any) {
    return this.projectsService.getFeed(user.id);
  }

  @Get("mine")
  @UseGuards(ClerkAuthGuard)
  async getMyProjects(@CurrentUser() user: any) {
    return this.projectsService.findByOwner(user.id);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.projectsService.findById(id);
  }
}
