import { Module } from "@nestjs/common";
import { ProcurementModule } from "./modules/procurement/procurement.module";

@Module({
  imports: [ProcurementModule],
  controllers: [],
  providers: [],
  exports: [ProcurementModule],
})
export class SupplyChainModule {}
