import { Injectable } from "@nestjs/common";
import { ProjectDocument } from "@prisma/client";

import { PrismaService } from "@/common/infrastructure/database/prisma/prisma.service";

import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";

import { UploadProjectDocumentData } from "../types";

@Injectable()
export class ProjectDocumentRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  async uploadDocument(
    documentData: UploadProjectDocumentData,
  ): Promise<ProjectDocument> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.projectDocument.create({
      data: {
        ...documentData,
        business_unit_id: requestContext.business_unit_id,
        created_by: requestContext.user_id,
      },
    });
  }
  async deleteDocument(documentId: number): Promise<ProjectDocument> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.projectDocument.delete({
      where: {
        id: documentId,
        business_unit_id: requestContext.business_unit_id,
      },
    });
  }

  // async getAllocationsMonth(
  //   projectId: number,
  //   startDate: Date,
  //   endDate: Date,
  // ): Promise<GetAllocationsMonthRecord[]> {
  //   const requestContext =
  //     this.requestContext.getStore() as LocalStorageContextData;

  //   return await this.prisma.projectAllocation.findMany({
  //     where: {
  //       assign_date: {
  //         gte: startDate,
  //         lte: endDate,
  //       },
  //       project_id: projectId,
  //       business_unit_id: requestContext.business_unit_id,
  //     },
  //     include: {
  //       people: true,
  //     },
  //   });
  // }
  // async updateAllocateDay(
  //   allocateId: number,
  //   allocateData: UpdateAllocateDayProjectInput,
  // ): Promise<UpdateAllocationDayRecord> {
  //   const requestContext =
  //     this.requestContext.getStore() as LocalStorageContextData;

  //   return await this.prisma.projectAllocation.update({
  //     where: {
  //       id: allocateId,
  //       business_unit_id: requestContext.business_unit_id,
  //     },
  //     data: { ...allocateData },
  //     include: {
  //       people: true,
  //     },
  //   });
  // }
}
