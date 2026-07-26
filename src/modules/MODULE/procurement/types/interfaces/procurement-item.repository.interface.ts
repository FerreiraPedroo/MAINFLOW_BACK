import { ProcurementItem } from "@prisma/client";
import {
  CreateProcurementItensInput,
  UpdateProcurementItensInput,
} from "../schemas";

export interface ProcurementItemRepository {
  findProcurementItens(procurement: number): Promise<ProcurementItem[]>;
  createProcurementItens(
    procurementData: CreateProcurementItensInput[],
  ): Promise<ProcurementItem[]>;
  updateProcurementItem(
    procurementData: UpdateProcurementItensInput,
  ): Promise<void>;
}
