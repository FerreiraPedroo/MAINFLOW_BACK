import { Module } from "@nestjs/common";
import { CostCenterModule } from "./cost_center/cost-center.module";
import { ManagerController } from "./manager.controller";

@Module({
  imports: [CostCenterModule],
  controllers: [ManagerController],
  providers: [],
})
export class ManagerModule {}
