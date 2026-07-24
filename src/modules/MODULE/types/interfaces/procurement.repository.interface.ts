import { Procurement, ProcurementItem } from "@prisma/client";
import { GetProcurementRecord } from "../record/get-procurement.record";
import { CreateProcurementData } from "../data/create-procurement.data";
import { UpdateProcurementData } from "../data/update-procurement.data";

export interface ProcurementRepository {
  getProcurement(procurement: number): Promise<GetProcurementRecord>;
  findProcurements(): Promise<Procurement[]>;
  createProcurement(
    procurementData: CreateProcurementData,
  ): Promise<Procurement>;
  procurementItens(procurementId: number): Promise<ProcurementItem[]>;
  updateProcurement(
    procurementId: number,
    procurementData: UpdateProcurementData,
  ): Promise<Procurement>;
}
