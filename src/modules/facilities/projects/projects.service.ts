import { CostCenterRepository } from "@modules/manager/cost_center/repositories/cost-center.repository";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";

import { ProjectRepository } from "./repository/project.repository";
import { FindProjectsResponse } from "./dto/find-projects-response.dto";
import { CreateProjectRequest } from "./dto/create-project-request.dto";
import { CreateProjectData } from "./data/create-project.data";

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
  async createProject({
    userId,
    businessUnitId,
    request,
    processModel,
  }: CreateProjectData) {
    if (request.costCenterId) {
      const foundCostCenter = await this.costCenterRepository.findById(
        request.costCenterId,
      );
      if (!foundCostCenter) {
        throw new UnprocessableEntityException(
          "O centro de custo que quer associar ao projeto não existe.",
        );
      }
    }

    console.log(processModel)

    const newProjectData = {
      ...(request.code && { code: request.code }),
      title: request.title,
      period: request.period,
      budget: request.budget ?? 0,
      status: request.status,
      process_id: 1,
      business_unit_id: request.businessId,
      ...(request.costCenterId && {
        cost_center_id: request.costCenterId,
      }),
    };

    const createdProject =
      await this.projectRepository.createProject(newProjectData);

    return createdProject;
  }
}
