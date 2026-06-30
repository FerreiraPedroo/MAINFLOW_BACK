import { Injectable } from "@nestjs/common";

import { ProjectRepository } from "./repository/project.repository";
import { FindAllProjectResponseDto } from "./dto/find-all-project-response.dto";

@Injectable()
export class ProjectsService {
  constructor(private projectRepository: ProjectRepository) {}

  async getById(id: number) {
    const project = await this.projectRepository.getById(id);

    if (!project) {
      return project;
    } else {
      return {
        id: project.id,
        code: project.code,
        title: project.title,
        period: project.period,
        budget: project.budget,
        status: project.status,
        cost_center: {
          id: project.cost_center.id,
          title: project.cost_center.title,
          description: project.cost_center.description,
        },
      };
    }
  }

  async findAll(): Promise<FindAllProjectResponseDto[]> {
    const projects = await this.projectRepository.findAll();

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
}
