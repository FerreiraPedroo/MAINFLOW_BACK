import { ProcurementItem } from "@prisma/client";
import { CreateProcurementItemData } from "../data/create-procurement-item.data";
import { UpdateProcurementItemData } from "../data/update-procurement-item.data";

export interface ProcurementItemRepository {
  findProcurementItens(procurement: number): Promise<ProcurementItem[]>;
  createProcurementItens(
    procurementData: CreateProcurementItemData[],
  ): Promise<ProcurementItem[]>;
  updateProcurementItem(
    procurementId: number,
    procurementData: UpdateProcurementItemData,
  ): Promise<void>;
}
