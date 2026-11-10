import { Module } from "@nestjs/common";
import { ContractModule } from "./contract";
import { BuildingModule } from "./building/building.module";
import { CostCenterModule } from "./cost-center/cost-center.module";
import { LocalizationModule } from "./localization/localization.module";

@Module({
  imports: [
    ContractModule,
    CostCenterModule,
    BuildingModule,
    LocalizationModule,
  ],
  exports: [
    ContractModule,
    CostCenterModule,
    BuildingModule,
    LocalizationModule,
  ],
})
export class BackOfficeModule {}
