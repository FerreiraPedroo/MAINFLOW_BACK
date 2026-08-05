import { Injectable } from "@nestjs/common";
import { ProjectAllocation } from "@prisma/client";

import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";

import {
  CreateAllocatePeopleToInput,
  GetAllocationsMonthRecord,
  UpdateAllocateDayProjectInput,
  UpdateAllocationDayRecord,
} from "../types";

@Injectable()
export class ProjectAllocationRepository {
  constructor(
    private readonly db: DatabaseService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  async allocatePeople(
    allocateData: CreateAllocatePeopleToInput,
  ): Promise<ProjectAllocation> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.projectAllocation.create({
      data: {
        ...allocateData,
        business_unit_id: requestContext.business_unit_id,
      },
    });
  }

  async getAllocationsMonth(
    projectId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<GetAllocationsMonthRecord[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.projectAllocation.findMany({
      where: {
        assign_date: {
          gte: startDate,
          lte: endDate,
        },
        project_id: projectId,
        business_unit_id: requestContext.business_unit_id,
      },
      include: {
        people: true,
      },
    });
  }
  async updateAllocateDay(
    allocateId: number,
    allocateData: UpdateAllocateDayProjectInput,
  ): Promise<UpdateAllocationDayRecord> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.projectAllocation.update({
      where: {
        id: allocateId,
        business_unit_id: requestContext.business_unit_id,
      },
      data: { ...allocateData },
      include: {
        people: true,
      },
    });
  }
  async deleteAlocallocateDay(allocateId: number): Promise<ProjectAllocation> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.projectAllocation.delete({
      where: {
        id: allocateId,
        business_unit_id: requestContext.business_unit_id,
        deleted_by: requestContext.user_id,
      },
    });
  }
}
