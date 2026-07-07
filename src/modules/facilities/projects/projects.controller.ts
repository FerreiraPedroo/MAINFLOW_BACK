import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ProjectsService } from "./projects.service.js";
import { FindProjectsResponse } from "./dto/find-projects-response.dto";
import type { CreateProjectRequest } from "./dto/create-project-request.dto.js";

@Controller("facilities/projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get(":id")
  getProjectById(@Param("id") id: number) {
    return this.projectsService.getProjectById(id);
  }
  @Get()
  async findProjects(): Promise<FindProjectsResponse[]> {
    return await this.projectsService.findProjects();
  }
  @Post()
  async createProject(@Body() request: CreateProjectRequest) {
    return await this.projectsService.createProject(request);
  }
}
