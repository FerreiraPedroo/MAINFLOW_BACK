import { Module } from "@nestjs/common";

import { LocalStorageContextModule } from "@common/context/local-storage-context.module";

import { InventoryController } from "./inventory.controller";

import { InventoryItemService } from "./inventory-item.service";

@Module({
  imports: [LocalStorageContextModule],
  controllers: [InventoryController],
  providers: [InventoryItemService],
})
export class InventoryModule {}
