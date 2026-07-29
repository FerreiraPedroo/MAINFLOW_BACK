import { InventoryItem } from "@prisma/client";
import { CreateInventoryItemInput, UpdateInventoryItemInput } from "../schemas";
import { GetInventoryItemRecord } from "../record";

export interface InventoryItemRepository {
  getInventoryItem(inventoryItemId: number): Promise<GetInventoryItemRecord>;
  findInventoryItems(inventoryItemId: number): Promise<InventoryItem[]>;
  createInventoryItem(
    inventoryItemInput: CreateInventoryItemInput,
  ): Promise<InventoryItem>;
  updateInventoryItem(
    inventoryItemId: number,
    inventoryItemInput: UpdateInventoryItemInput,
  ): Promise<InventoryItem>;
}
