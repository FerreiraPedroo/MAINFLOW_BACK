import { Module } from "@nestjs/common";

import { LocalStorageContextModule } from "@common/context/local-storage-context.module";

import { InventoryController } from "./inventory.controller";

import { InventoryItemService } from "./inventory-item.service";
import { InventoryItemRepository } from "./infrastructure/repositories/inventory-item.repository";
@Module({
  imports: [LocalStorageContextModule],
  controllers: [InventoryController],
  providers: [InventoryItemService, InventoryItemRepository],
})
export class InventoryModule {}
