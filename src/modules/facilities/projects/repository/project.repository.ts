import { Injectable } from "@nestjs/common";
import { Project } from "@prisma/client";

import { PrismaService } from "@/common/infrastructure/database/prisma/prisma.service";

import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";

import {
  ProjectRecord,
  CreateProjectInput,
  UpdateProjectInput,
} from "../types";

@Injectable()
export class ProjectRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  async getProjectsById(id: number): Promise<ProjectRecord> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.project.findUnique({
      where: {
        id: id,
        business_unit_id: requestContext.business_unit_id,
      },
      include: {
        cost_center: true,
        procurements: true,
        project_allocations: {
          include: {
            people: true,
          },
        },
      },
    });
  }
  async findProjects(): Promise<Project[] | null> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.project.findMany({
      where: {
        business_unit_id: requestContext.business_unit_id,
      },
    });
  }
  async createProject(projectData: CreateProjectInput): Promise<Project> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.project.create({
      data: {
        ...projectData,
        business_unit_id: requestContext.business_unit_id,
        created_by: requestContext.user_id,
      },
    });
  }
  async updateProject(
    projectId: number,
    projectInput: UpdateProjectInput,
  ): Promise<Project> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return this.prisma.project.update({
      where: {
        id: projectId,
        business_unit_id: requestContext.business_unit_id,
      },
      data: {
        ...projectInput,
        updated_by: requestContext.user_id,
      },
    });
  }
  async deleteProject(projectId: number) {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    await this.prisma.project.update({
      where: {
        id: projectId,
        business_unit_id: requestContext.business_unit_id,
      },
      data: {
        deleted_at: new Date(),
        deleted_by: requestContext.user_id,
      },
    });
  }
}
