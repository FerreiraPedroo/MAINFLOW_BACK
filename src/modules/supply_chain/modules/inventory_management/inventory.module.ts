import { Module } from "@nestjs/common";
import { UnitOfWorkModule } from "@common/infrastructure/unit-of-work/unit-of-work.module";
import { LocalStorageContextModule } from "@common/context/local-storage-context.module";

import { InventoryController } from "./inventory.controller";

import { InventoryItemService } from "./inventory-item.service";

import { InventoryItemPrismaRepository } from "./repositories/inventory-item.prisma.repository";

@Module({
  imports: [LocalStorageContextModule, UnitOfWorkModule],
  controllers: [InventoryController],
  providers: [
    InventoryItemService,
    {
      provide: "InventoryItemRepository",
      useClass: InventoryItemPrismaRepository,
    },
  ],
})
export class InventoryModule {}
