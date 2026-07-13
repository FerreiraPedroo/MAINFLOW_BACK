import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/database/prisma/prisma.service";

import { Project } from "@prisma/client";
import { ProjectComplete } from "../interfaces/project-complete.type";
import { CreateProjectData } from "../dto/create-project-data.dto";

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getProjectsById(id: number): Promise<ProjectComplete | null> {
    return await this.prisma.project.findUnique({
      where: { id: Number(id) },
      include: {
        cost_center: true,
      },
    });
  }

  async findProjects(): Promise<Project[] | null> {
    return await this.prisma.project.findMany();
  }

  async createProject(projectData: CreateProjectData) {
    return await this.prisma.project.create({
      data: projectData,
    });
  }
}
