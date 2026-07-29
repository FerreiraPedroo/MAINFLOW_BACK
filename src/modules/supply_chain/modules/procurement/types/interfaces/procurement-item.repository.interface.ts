import { ProcurementItem } from "@prisma/client";
import {
  CreateProcurementItemsInput,
  UpdateProcurementItemsInput,
} from "../schemas";

export interface ProcurementItemRepository {
  findProcurementItems(procurement: number): Promise<ProcurementItem[]>;
  createProcurementItems(
    procurementData: CreateProcurementItemsInput[],
  ): Promise<ProcurementItem[]>;
  updateProcurementItem(
    procurementData: UpdateProcurementItemsInput,
  ): Promise<void>;
}
