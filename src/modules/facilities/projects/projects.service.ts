import { CostCenterRepository } from "@modules/manager/cost_center/repositories/cost-center.repository";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";

import { ProjectRepository } from "./repository/project.repository";

import { GetProjectByIdResponse } from "./types/dto/get-project-by-id-response.dto";

import { FindProjectsResponse } from "./types/dto/find-projects-response.dto";

import { CreateProjectResponse } from "./types/dto/create-project-response.dto";
import { CreateProjectRequest } from "./types/dto/create-project-request.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { UpdateProjectRequest } from "./types/dto/update-project-request.dto";
import { Project } from "@prisma/client";

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
        default: {
          throw new UnprocessableEntityException(error);
        }
      }
    } else {
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
      return await this.projectRepository.updateProject(projectId, projectData);
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
}
