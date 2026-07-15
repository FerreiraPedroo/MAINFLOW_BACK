import { Module } from "@nestjs/common";
import { CostCenterModule } from "./cost_center/cost-center.module";
import { LocalizationModule } from "./localization/localization.module";

@Module({
  imports: [CostCenterModule, LocalizationModule],
  exports: [CostCenterModule, LocalizationModule],
})
export class ManagerModule {}
