import { Module } from "@nestjs/common";
import { CostCenterModule } from "./cost_center/cost-center.module";
import { DepartmentModule } from "./department/department.module";

@Module({
  imports: [CostCenterModule, DepartmentModule],
  exports: [CostCenterModule, DepartmentModule],
})
export class ManagerModule {}
