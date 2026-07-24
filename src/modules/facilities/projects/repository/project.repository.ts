import { Injectable } from "@nestjs/common";
import { Project, ProjectAllocation } from "@prisma/client";

import { PrismaService } from "@/database/prisma/prisma.service";

import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";

import { ProjectRecord } from "../types/record/project.record";
import { CreateProjectData } from "../types/data/create-project.data";
import { UpdateProjectData } from "../types/data/update-project.data";
import { AllocatePeopleToProjectData } from "../types/data/allocate-people-to-project.data";
import { UpdateAllocateDayData } from "../types/data/update-allocate-dat.data";

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
    const userContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.project.findUnique({
      where: {
        id: Number(id),
        business_unit_id: Number(userContext.businessUnitId),
      },
      include: {
        cost_center: true,
        procurements: true,
      },
    });
  }
  async findProjects(): Promise<Project[] | null> {
    const userContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.project.findMany({
      where: {
        business_unit_id: Number(userContext.businessUnitId),
      },
    });
  }
  async createProject(projectData: CreateProjectData): Promise<Project> {
    const userContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.project.create({
      data: {
        business_unit_id: Number(userContext.businessUnitId),
        created_by: Number(userContext.userId),
        ...projectData,
      },
    });
  }
  async updateProject(
    projectId: number,
    projectData: UpdateProjectData,
  ): Promise<Project> {
    const userContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return this.prisma.project.update({
      where: {
        id: Number(projectId),
        business_unit_id: Number(userContext.businessUnitId),
      },
      data: {
        ...projectData,
        updated_by: Number(userContext.userId),
      },
    });
  }
  async deleteProject(projectId: number) {
    const userContext =
      this.requestContext.getStore() as LocalStorageContextData;

    await this.prisma.project.update({
      where: {
        id: Number(projectId),
        business_unit_id: Number(userContext.businessUnitId),
      },
      data: {
        deleted_at: new Date(),
        deleted_by: Number(userContext.userId),
      },
    });
  }

  /////////////////////////////////////////////////////////////////////////////////
  // ALLOCATIONS
  async allocatePeopleToProject(
    allocateData: AllocatePeopleToProjectData,
  ): Promise<ProjectAllocation> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;
    console.log(allocateData);
    return await this.prisma.projectAllocation.create({
      data: {
        ...allocateData,
        business_unit_id: Number(requestContext.businessUnitId),
      },
    });
  }
  async desallocatePeopleToProject(
    allocateId: number,
  ): Promise<ProjectAllocation> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.projectAllocation.delete({
      where: {
        id: Number(allocateId),
        business_unit_id: Number(requestContext.businessUnitId),
      },
    });
  }
  async getMonthProjectAllocations(
    projectId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<ProjectAllocation[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    console.log({ projectId, startDate, endDate });

    return await this.prisma.projectAllocation.findMany({
      where: {
        assign_date: {
          gte: startDate,
          lte: endDate,
        },
        project_id: Number(projectId),
        business_unit_id: Number(requestContext.businessUnitId),
      },
    });
  }
  async updateAllocateDay(
    allocateId: number,
    allocateData: UpdateAllocateDayData,
  ): Promise<ProjectAllocation> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.projectAllocation.update({
      where: {
        id: Number(allocateId),
        business_unit_id: Number(requestContext.businessUnitId),
      },
      data: { ...allocateData },
    });
  }
}
