import { Module } from "@nestjs/common";
import { CostCenterModule } from "./cost_center/cost-center.module";
import { LocalizationModule } from "./localization/localization.module";
import { BuildingModule } from "./building/building.module";

@Module({
  imports: [CostCenterModule, LocalizationModule, BuildingModule],
  exports: [CostCenterModule, LocalizationModule, BuildingModule],
})
export class OrganizationModule {}
