import { Module } from "@nestjs/common";
import { ProcurementModule } from "@modules/supply_chain/modules/procurement/procurement.module";
import { InventoryModule } from "@modules/supply_chain/modules/inventory_management/inventory.module";

@Module({
  imports: [ProcurementModule, InventoryModule],
  controllers: [],
  providers: [],
  exports: [ProcurementModule],
})
export class SupplyChainModule {}
