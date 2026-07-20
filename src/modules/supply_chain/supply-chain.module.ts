import { Module } from "@nestjs/common";
import { ProcurementModule } from "./modules/procurement/procurement.module";

@Module({
  imports: [ProcurementModule],
  controllers: [],
  providers: [],
})
export class SupplyChainModule {}
