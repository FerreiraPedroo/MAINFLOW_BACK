import { Module } from "@nestjs/common";
import { CostCenterModule } from "../organization/cost_center/cost-center.module";
import { LocalizationModule } from "../organization/localization/localization.module";
import { BuildingModule } from "../organization/building/building.module";

@Module({
  imports: [CostCenterModule, LocalizationModule, BuildingModule],
  exports: [CostCenterModule, LocalizationModule, BuildingModule],
})
export class ManagerModule {}
