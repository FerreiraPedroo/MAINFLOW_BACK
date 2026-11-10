import { Module } from "@nestjs/common";
import { ProcurementModule } from "@/modules/supply-chain/modules/procurement/procurement.module";
import { InventoryModule } from "@/modules/supply-chain/modules/inventory_management/inventory.module";

@Module({
  imports: [ProcurementModule, InventoryModule],
  controllers: [],
  providers: [],
  exports: [ProcurementModule],
})
export class SupplyChainModule {}
