import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { FindProjectsResponse } from "./dto/find-projects-response.dto";
import type { CreateProjectRequest } from "./dto/create-project-request.dto";
import { ProcessService } from "@modules/process/process.service";
import { LocalStorageContextService } from "@common/context/local-storage-context.service";
import { LocaStorageContextData } from "@common/context/interfaces/local-storage-context.data";

@Controller("facilities/projects")
export class ProjectsController {
  constructor(
    private readonly processService: ProcessService,
    private readonly projectsService: ProjectsService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  @Get()
  async findProjects(): Promise<FindProjectsResponse[]> {
    return await this.projectsService.findProjects();
  }
  @Get(":id")
  getProjectById(@Param("id") id: number) {
    return this.projectsService.getProjectById(id);
  }
  @Post()
  async createProject(@Body() request: CreateProjectRequest) {
    const userData = this.requestContext.getStore() as LocaStorageContextData;

    const processModel =
      await this.processService.getProcessModelByProcessCall("CREATE:PROJECT");

    if (!processModel) {
      throw new InternalServerErrorException(
        "Erro interno ao criar o projeto, contate o administrador do sitema.",
      );
    }

    return await this.projectsService.createProject({
      userId: userData.userId,
      businessUnitId: userData.businessUnitId,
      request,
      processModel,
    });
  }
}
