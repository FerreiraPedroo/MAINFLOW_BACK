import { CostCenterRepository } from "@modules/manager/cost_center/repositories/cost-center.repository";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";

import { ProjectRepository } from "./repository/project.repository";
import { FindProjectsResponse } from "./dto/find-projects-response.dto";
import { CreateProjectRequest } from "./dto/create-project-request.dto";

@Injectable()
export class ProjectsService {
  constructor(
    private projectRepository: ProjectRepository,
    private costCenterRepository: CostCenterRepository,
  ) {}

  async getProjectById(id: number) {
    const project = await this.projectRepository.getProjectsById(id);

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
  async createProject(request: CreateProjectRequest) {
    if (request.projectData.costCenterId) {
      const foundCostCenter = await this.costCenterRepository.findById(
        request.projectData.costCenterId,
      );
      if (!foundCostCenter) {
        throw new UnprocessableEntityException(
          "O centro de custo que quer associar ao projeto não existe.",
        );
      }
    }

    const newProjectData = {
      ...(request.projectData.code && { code: request.projectData.code }),
      title: request.projectData.title,
      period: request.projectData.period,
      budget: request.projectData.budget ?? 0,
      status: request.projectData.status,
      process_id: 1,
      business_unit_id: request.businessId,
      ...(request.projectData.costCenterId && {
        cost_center_id: request.projectData.costCenterId,
      }),
    };

    const createdProject =
      await this.projectRepository.createProject(newProjectData);

    return createdProject;
  }
}
