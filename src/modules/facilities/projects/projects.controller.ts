import { Controller, Get, Param, Query } from "@nestjs/common";
import { ProjectsService } from "./projects.service.js";

@Controller("/facilities/projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get("/:id")
  getProject(@Param("id") id: number): string {
    return this.projectsService.getProject(id);
  }
  @Get()
  findProject(@Query() query: FindProjectDto): string {
    return this.projectsService.findProject(query);
  }
}
