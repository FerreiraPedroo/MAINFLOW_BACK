import { Procurement, ProcurementItem } from "@prisma/client";
import { GetInventoryItemRecord } from "../record/get-inventory-item.record";

import {CreateInventoryItemInput, UpdateInventoryItemInput } from "../schemas";

export interface ProcurementRepository {
  getProcurement(procurement: number): Promise<GetInventoryItemRecord>;
  findProcurements(): Promise<Procurement[]>;
  createProcurement(
    procurementData: CreateInventoryItemInput,
  ): Promise<Procurement>;
  procurementItems(procurementId: number): Promise<ProcurementItem[]>;
  updateProcurement(
    procurementId: number,
    procurementData: UpdateInventoryItemInput,
  ): Promise<Procurement>;
}
