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
import type { UpdateAllocateDayRequest } from "./types/dto/update-allocate-day-request.dto";
import type { AllocatePeopleToProjectRequest } from "./types/dto/allocate-project-to-people-request.dto";

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

  /////////////////////////////////////////////////////////////////////////////////
  // ALLOCATIONS
  @Post("allocate")
  async allocatePeopleToProject(
    @Body() request: AllocatePeopleToProjectRequest,
  ) {
    return this.projectsService.allocatePeopleToProject(request);
  }
  @Delete("allocate/:allocateId")
  async desallocatePeopleToProject(@Param("allocateId") allocateId: number) {
    return this.projectsService.desallocatePeopleToProject(allocateId);
  }
  @Get("allocate/:projectId/:year/:month")
  async getMonthProjectAllocations(
    @Param("projectId") projectId: number,
    @Param("year") year: number,
    @Param("month") month: number,
  ) {
    return await this.projectsService.getMonthProjectAllocations(
      projectId,
      year,
      month,
    );
  }
  @Put("allocate/:allocateId")
  async updateAllocateDay(
    @Param("allocateId") projectId: number,
    @Body() request: UpdateAllocateDayRequest,
  ) {
    return await this.projectsService.updateAllocateDay(projectId, request);
  }
}
