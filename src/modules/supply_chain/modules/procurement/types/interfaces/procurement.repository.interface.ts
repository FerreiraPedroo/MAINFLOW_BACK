import { Procurement, ProcurementItem } from "@prisma/client";
import { GetProcurementRecord } from "../record/get-procurement.record";

import { CreateProcurementInput } from "../schemas/create-procurement.schema";
import { UpdateProcurementInput } from "../schemas";

export interface ProcurementRepository {
  getProcurement(procurement: number): Promise<GetProcurementRecord>;
  findProcurements(): Promise<Procurement[]>;
  createProcurement(
    procurementData: CreateProcurementInput,
  ): Promise<Procurement>;
  procurementItems(procurementId: number): Promise<ProcurementItem[]>;
  updateProcurement(
    procurementId: number,
    procurementData: UpdateProcurementInput,
  ): Promise<Procurement>;
}
