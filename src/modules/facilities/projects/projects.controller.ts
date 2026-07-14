import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";

import { ProjectsService } from "./projects.service";
import type { UpdateProjectRequest } from "./types/dto/update-project-request.dto";
import type { CreateProjectRequest } from "./types/dto/create-project-request.dto";

@Controller("facilities/projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get(":projectId")
  async getProjectById(@Param("projectId") projectId: number) {
    return await this.projectsService.getProjectById(projectId);
  }
  @Get()
  async findProjects() {
    return await this.projectsService.findProjects();
  }
  @Post()
  async createProject(@Body() request: CreateProjectRequest) {
    return await this.projectsService.createProject(request);
  }
  @Put(":projectId")
  async updateProjectId(
    @Param("projectId") projectId: number,
    @Body() request: UpdateProjectRequest,
  ) {
    return await this.projectsService.updateProject(projectId, request);
  }
  // @Delete(":projectId")
  // async deleteProject(@Param("projectId") projectId: number) {
  //   return await this.projectsService.deleteProject(projectId);
  // }
}
