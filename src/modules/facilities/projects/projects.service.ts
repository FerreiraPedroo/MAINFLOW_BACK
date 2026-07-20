import { Project } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";

import { CostCenterRepository } from "@modules/manager/cost_center/repositories/cost-center.repository";

import { ProjectRepository } from "./repository/project.repository";

import { FindProjectsResponse } from "./types/dto/find-projects-response.dto";
import { CreateProjectRequest } from "./types/dto/create-project-request.dto";
import { UpdateProjectRequest } from "./types/dto/update-project-request.dto";
import { CreateProjectResponse } from "./types/dto/create-project-response.dto";
import { GetProjectByIdResponse } from "./types/dto/get-project-by-id-response.dto";
import { AllocatePeopleToProjectRequest } from "./types/dto/allocate-project-to-people-request.dto";
import { UpdateAllocateDayRequest } from "./types/dto/update-allocate-day-request.dto";

@Injectable()
export class ProjectsService {
  constructor(
    private projectRepository: ProjectRepository,
    private costCenterRepository: CostCenterRepository,
  ) {}

  private prismaErrors(error: any): never {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2001": {
          throw new UnprocessableEntityException(
            `O projeto a ser excluído não encontrado.`,
          );
          break;
        }
        case "P2002": {
          const meta = error.meta?.driverAdapterError as any;
          const fields = meta?.cause?.constraint?.fields
            ?.join(" / ")
            .toUpperCase();

          throw new UnprocessableEntityException(
            `Existe um projeto com esses dados: ${fields}`,
          );
          break;
        }
        case "P2025": {
          throw new UnprocessableEntityException(
            "Não foi possivel encontrar um registro necessário para executar a tarefa.",
          );
        }
        default: {
          throw new UnprocessableEntityException(error);
        }
      }
    } else {
      console.log(error);
      throw new UnprocessableEntityException(
        "Não foi possivel executar a ação.",
      );
    }
  }

  async getProjectById(projectId: number): Promise<GetProjectByIdResponse> {
    let project;
    try {
      project = await this.projectRepository.getProjectsById(projectId);
    } catch (error) {
      this.prismaErrors(error);
    }

    if (!project) {
      throw new UnprocessableEntityException("Projeto não encontrado.");
    } else {
      return {
        id: project.id,
        code: project.code,
        title: project.title,
        period: project.period,
        budget: project.budget,
        status: project.status,
        costCenter: project.cost_center
          ? {
              id: project.cost_center.id,
              title: project.cost_center.title,
              description: project.cost_center.description,
            }
          : null,
      };
    }
  }
  async findProjects(): Promise<FindProjectsResponse[]> {
    const projects = await this.projectRepository.findProjects();

    if (!projects) {
      return [];
    } else {
      return projects.map((project) => ({
        id: project.id,
        code: project.code,
        title: project.title,
        period: project.period,
        status: project.status,
      }));
    }
  }
  async createProject(
    projectInput: CreateProjectRequest,
  ): Promise<CreateProjectResponse> {
    if (projectInput.costCenterId) {
      const foundCostCenter = await this.costCenterRepository.findById(
        projectInput.costCenterId,
      );
      if (!foundCostCenter) {
        throw new UnprocessableEntityException(
          "O centro de custo que quer associar ao projeto não existe.",
        );
      }
    }

    const projectInputData = {
      code: projectInput.code ?? null,
      title: projectInput.title,
      period: projectInput.period,
      budget: projectInput.budget ?? 0,
      status: projectInput.status,
      // process_id: 1,
      cost_center_id: projectInput.costCenterId ?? null,
    };

    let createdProject: Project;
    try {
      createdProject =
        await this.projectRepository.createProject(projectInputData);
    } catch (error) {
      this.prismaErrors(error);
    }

    const projectData = {
      id: createdProject.id,
      code: createdProject.code,
      title: createdProject.title,
      period: createdProject.period,
      budget: createdProject.budget,
      status: createdProject.status,
      businessUnitId: createdProject.business_unit_id,
      costCenterId: createdProject.cost_center_id,
      // processId: createdProject.process_id,
    };

    return projectData;
  }
  async updateProject(projectId: number, request: UpdateProjectRequest) {
    const projectData = {
      ...((request.code || request.code == null) && {
        code: request.code,
      }),
      ...(request.title && { title: request.title }),
      ...(request.period && { period: request.period }),
      ...((request.budget || request.budget == 0) && {
        budget: request.budget,
      }),
      ...(request.status && { status: request.status }),
      ...(request.costCenterId && {
        cost_center_id: request.costCenterId,
      }),
    };

    try {
      const projectRecord = await this.projectRepository.updateProject(
        projectId,
        projectData,
      );
      return {
        id: projectRecord.id,
        code: projectRecord.code,
        title: projectRecord.title,
        period: projectRecord.period,
        status: projectRecord.status,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async deleteProject(projectId: number) {
    try {
      return await this.projectRepository.deleteProject(projectId);
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////
  // ALLOCATIONS
  // - alocação de pessoas no projeto por dia.
  async allocatePeopleToProject(request: AllocatePeopleToProjectRequest) {
    const assignDate = new Date(request.assignDate);

    if (assignDate.toLocaleString() == "Invalid Date") {
      throw new UnprocessableEntityException("Data inválida.");
    }

    const allocateData = {
      project_id: request.projectId,
      people_id: request.peopleId,
      assign_date: assignDate,
      start_hour: request.startHour,
      end_hour: request.endHour,
    };

    try {
      const allocateRecord =
        await this.projectRepository.allocatePeopleToProject(allocateData);

      return {
        projectId: allocateRecord.project_id,
        peopleId: allocateRecord.people_id,
        assignDate: allocateRecord.assign_date,
        startHour: allocateRecord.start_hour,
        endHour: allocateRecord.end_hour,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async desallocatePeopleToProject(allocateId: number) {
    try {
      return await this.projectRepository.desallocatePeopleToProject(
        allocateId,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async getMonthProjectAllocations(
    projectId: number,
    year: number,
    month: number,
  ) {
    const startDate = new Date(year, month - 1);
    const endDate = new Date(year, month, 0);

    if (
      startDate.toLocaleString() == "Invalid Date" ||
      endDate.toLocaleString() == "Invalid Date"
    ) {
      throw new UnprocessableEntityException("Data inválida.");
    }

    try {
      const allocateRecords =
        await this.projectRepository.getMonthProjectAllocations(
          projectId,
          startDate,
          endDate,
        );

      return allocateRecords.map((allocate) => ({
        projectId: allocate.project_id,
        peopleId: allocate.people_id,
        assignDate: allocate.assign_date,
        startHour: allocate.start_hour,
        endHour: allocate.end_hour,
      }));
    } catch (error) {
      this.prismaErrors(error);
    }

    console.log(startDate, { endDate });
  }
  async updateAllocateDay(
    projectId: number,
    request: UpdateAllocateDayRequest,
  ) {
    const allocateDta = {
      ...(request.peopleId && { people_id: request.peopleId }),
      ...(request.startHour && { start_hour: request.startHour }),
      ...(request.endHour && { end_hour: request.endHour }),
    };

    if (!Object.keys(allocateDta).length) {
      throw new UnprocessableEntityException(
        "Não foi enviado nenhum dado para ser atualizado.",
      );
    }

    try {
      const allocateRecord = await this.projectRepository.updateAllocateDay(
        projectId,
        allocateDta,
      );

      return {
        projectId: allocateRecord.project_id,
        peopleId: allocateRecord.people_id,
        assignDate: allocateRecord.assign_date,
        startHour: allocateRecord.start_hour,
        endHour: allocateRecord.end_hour,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  ////////////////////////////////////////////////////////////////////////////////
}
