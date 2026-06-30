import { Module } from "@nestjs/common";
import { CostCenterModule } from "./cost_center/cost-center.module";
import { ManagerController } from "./manager.controller";
import { DepartmentModule } from "./department/department.module";

@Module({
  imports: [CostCenterModule, DepartmentModule],
  controllers: [ManagerController],
  providers: [],
})
export class ManagerModule {}
