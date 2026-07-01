import { Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ProjectsService } from "./projects.service.js";
import { FindAllProjectResponseDto } from "./dto/find-all-project-response.dto.js";

@Controller("/facilities/projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get("/:id")
  getProject(@Param("id") id: number) {
    return this.projectsService.getById(id);
  }
  @Get()
  async findAll(): Promise<FindAllProjectResponseDto[]> {
    return await this.projectsService.findAll();
  }
}
