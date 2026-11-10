import { Injectable } from "@nestjs/common";

import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import { ProcurementItem } from "@prisma/client";

import {
  CreateProcurementItemsInput,
  UpdateProcurementItemsInput,
} from "../../contracts";

@Injectable()
export class ProcurementItemRepository {
  constructor(
    private readonly db: DatabaseService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  async findProcurementItems(
    procurementId: number,
  ): Promise<ProcurementItem[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.procurementItem.findMany({
      where: {
        procurement_id: procurementId,
        business_unit_id: requestContext.business_unit_id,
      },
    });
  }
  async createProcurementItems(
    procurementItemsData: CreateProcurementItemsInput[],
  ) {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    const data = procurementItemsData.map((pid) => ({
      ...pid,
      created_by: requestContext.user_id,
      business_unit_id: requestContext.business_unit_id,
    }));

    return await this.db.client.procurementItem.createMany({
      data,
    });
  }
  async deleteProcurementItems(procurementItemsIds: number[]) {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.procurementItem.deleteMany({
      where: {
        id: { in: procurementItemsIds },
        business_unit_id: requestContext.business_unit_id,
      },
    });
  }
  async updateProcurementItem(procurementItem: UpdateProcurementItemsInput) {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.procurementItem.update({
      where: {
        id: procurementItem.id,
        business_unit_id: requestContext.business_unit_id,
      },
      data: {
        quantity: procurementItem.quantity,
        updated_by: requestContext.user_id,
      },
    });
  }
}
