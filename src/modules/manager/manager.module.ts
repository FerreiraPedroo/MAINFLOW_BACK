import { Module } from "@nestjs/common";
import { CostCenterModule } from "./cost_center/cost-center.module";

@Module({
  imports: [CostCenterModule],
  exports: [CostCenterModule],
})
export class ManagerModule {}
