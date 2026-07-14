import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/database/prisma/prisma.service";

import { Project } from "@prisma/client";
import { ProjectRecord } from "../types/record/project.record";
import { CreateProjectData } from "../types/data/create-project.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { LocaStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { UpdateProjectData } from "../types/data/update-project.data";

/**
 * A definição do BUSINESS_UNIT_ID é feito no repositório.
 */
@Injectable()
export class ProjectRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  async getProjectsById(id: number): Promise<ProjectRecord | null> {
    const userData = this.requestContext.getStore() as LocaStorageContextData;

    return await this.prisma.project.findUnique({
      where: {
        id: Number(id),
        business_unit_id: Number(userData.businessUnitId),
      },
      include: {
        cost_center: true,
      },
    });
  }

  async findProjects(): Promise<Project[] | null> {
    const userData = this.requestContext.getStore() as LocaStorageContextData;

    return await this.prisma.project.findMany({
      where: {
        business_unit_id: Number(userData.businessUnitId),
      },
    });
  }

  async createProject(projectData: CreateProjectData): Promise<Project> {
    const userData = this.requestContext.getStore() as LocaStorageContextData;

    return await this.prisma.project.create({
      data: {
        business_unit_id: Number(userData.businessUnitId),
        created_by: Number(userData.userId),
        ...projectData,
      },
    });
  }

  async updateProject(
    projectId: number,
    projectData: UpdateProjectData,
  ): Promise<Project> {
    const userData = this.requestContext.getStore() as LocaStorageContextData;

    return this.prisma.project.update({
      where: {
        id: Number(projectId),
        business_unit_id: Number(userData.businessUnitId),
      },
      data: {
        ...projectData,
        updated_by: Number(userData.userId),
      },
    });
  }

  async deleteProject(projectId: number) {
    const userData = this.requestContext.getStore() as LocaStorageContextData;

    await this.prisma.project.update({
      where: {
        id: Number(projectId),
        business_unit_id: Number(userData.businessUnitId),
      },
      data: {
        deleted_at: new Date(),
        deleted_by: Number(userData.userId),
      },
    });
  }
}
