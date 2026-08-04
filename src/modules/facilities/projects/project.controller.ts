import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { ProjectService } from "./project.service";
import { ProjectAllocationService } from "./project-allocation.service";

import { ValidateService } from "@/common/decorators/validate-service.decorator";

import type {
  GetProjectInputDto,
  CreateProjectDto,
  UpdateProjectDto,
  CreateAllocatePeopleToProjectDto,
  UpdateAllocateDayProjectDto,
  UploadProjectDocumentFileDto,
  UploadProjectDocumentDto,
} from "./types";
import {
  FindProjectsOutputSchema,
  GetProjectInputSchema,
  GetProjectOutputSchema,
  CreateProjectInputSchema,
  CreateProjectOutputSchema,
  UpdateProjectInputSchema,
  UpdateProjectOutputSchema,
  CreateAllocatePeopleToInputSchema,
  CreateAllocatePeopleToOutputSchema,
  GetAllocationsMonthProjectInputSchema,
  GetAllocationsMonthProjectOutputSchema,
  UpdateAllocateDayProjectInputSchema,
  UpdateAllocateDayProjectOutputSchema,
  DeleteAllocateDayProjectInputSchema,
  DeleteAllocateDayProjectOutputSchema,
  UploadProjectDocumentInputSchema,
  UploadProjectDocumentOutputSchema,
} from "./types";

@Controller("facilities/projects")
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly projectAllocationService: ProjectAllocationService,
  ) {}

  @Get(":projectId")
  @ValidateService({
    input: GetProjectInputSchema,
    output: GetProjectOutputSchema,
  })
  async getProjectById(@Param("projectId") projectId: GetProjectInputDto) {
    return await this.projectService.getProjectById(projectId);
  }

  @Get()
  @ValidateService({ output: FindProjectsOutputSchema })
  async findProjects() {
    return await this.projectService.findProjects();
  }

  @Post()
  @ValidateService({
    input: CreateProjectInputSchema,
    output: CreateProjectOutputSchema,
  })
  async createProject(@Body() request: CreateProjectDto) {
    return await this.projectService.createProject(request);
  }

  @Put(":projectId")
  @ValidateService({
    input: UpdateProjectInputSchema,
    output: UpdateProjectOutputSchema,
  })
  async updateProjectId(
    @Param("projectId") projectId: number,
    @Body() request: UpdateProjectDto,
  ) {
    return await this.projectService.updateProject(projectId, request);
  }

  /////////////////////////////////////////////////////////////////////////////////
  // ALLOCATIONS
  /////////////////////////////////////////////////////////////////////////////////
  @Post("allocate")
  @ValidateService({
    input: CreateAllocatePeopleToInputSchema,
    output: CreateAllocatePeopleToOutputSchema,
  })
  async allocatePeople(@Body() request: CreateAllocatePeopleToProjectDto) {
    return this.projectAllocationService.allocatePeople(request);
  }

  @Get("allocate/:projectId/:year/:month")
  @ValidateService({
    input: GetAllocationsMonthProjectInputSchema,
    output: GetAllocationsMonthProjectOutputSchema,
  })
  async getAllocationsMonth(
    @Param("projectId") projectId: number,
    @Param("year") year: number,
    @Param("month") month: number,
  ) {
    return await this.projectAllocationService.getAllocationsMonth(
      projectId,
      year,
      month,
    );
  }

  @Put("allocate/:allocateId")
  @ValidateService({
    input: UpdateAllocateDayProjectInputSchema,
    output: UpdateAllocateDayProjectOutputSchema,
  })
  async updateAllocateDay(
    @Param("allocateId") allocateId: number,
    @Body() request: UpdateAllocateDayProjectDto,
  ) {
    return await this.projectAllocationService.updateAllocateDay(
      allocateId,
      request,
    );
  }

  @Delete("allocate/:allocateId")
  @ValidateService({
    input: DeleteAllocateDayProjectInputSchema,
    output: DeleteAllocateDayProjectOutputSchema,
  })
  async deleteAlocallocateDay(@Param("allocateId") allocateId: number) {
    return this.projectAllocationService.deleteAlocallocateDay(allocateId);
  }

  /////////////////////////////////////////////////////////////////////////////////
  // DOCUMENTS
  /////////////////////////////////////////////////////////////////////////////////
  @Post("documents")
  @UseInterceptors(FileInterceptor("document"))
  @ValidateService({
    input: UploadProjectDocumentInputSchema,
    output: UploadProjectDocumentOutputSchema,
  })
  async uploadDocument(
    @UploadedFile()
    document: UploadProjectDocumentFileDto,
    @Body() request: UploadProjectDocumentDto,
  ) {
    return await this.projectService.uploadDocument(document, request);
  }
}
