import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/database/prisma/prisma.service";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";

import { ProcurementItem } from "@prisma/client";

import {
  ProcurementItemRepository,
  CreateProcurementItensInput,
  UpdateProcurementItensInput,
} from "../types";

@Injectable()
export class ProcurementItemPrismaRepository implements ProcurementItemRepository {
  constructor(
    private prisma: PrismaService,
    private requestContext: LocalStorageContextService,
  ) {}

  async findProcurementItens(
    procurementId: number,
  ): Promise<ProcurementItem[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    const client = requestContext.tx || this.prisma;

    return await client.procurementItem.findMany({
      where: {
        procurement_id: procurementId,
        business_unit_id: requestContext.business_unit_id,
      },
    });
  }
  async createProcurementItens(
    procurementItensData: CreateProcurementItensInput[],
  ): Promise<ProcurementItem[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    const client = requestContext?.tx || this.prisma;

    const data = procurementItensData.map((pid) => ({
      ...pid,
      created_by: requestContext.userId,
      business_unit_id: requestContext.business_unit_id,
    }));

    return await client.procurementItem.createMany({
      data,
    });
  }
  async deleteProcurementItens(
    procurementItensIds: number[],
  ): Promise<ProcurementItem[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    const client = requestContext?.tx || this.prisma;

    return await client.procurementItem.deleteMany({
      where: {
        id: { in: procurementItensIds },
        business_unit_id: requestContext.business_unit_id,
      },
    });
  }
  async updateProcurementItem(procurementItem: UpdateProcurementItensInput) {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    const client = requestContext.tx || this.prisma;

    return await client.procurementItem.update({
      where: {
        id: procurementItem.id,
        business_unit_id: requestContext.business_unit_id,
      },
      data: {
        quantity: procurementItem.quantity,
        updated_by: requestContext.userId,
      },
    });
  }
}
