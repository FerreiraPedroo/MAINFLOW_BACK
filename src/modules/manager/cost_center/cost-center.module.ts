import { Module } from "@nestjs/common";
import { CostCenterController } from "./cost-center.controller";
import { CostCenterService } from "./cost-center.service";
import { CostCenterRepository } from "./repositories/cost-center.repository";

@Module({
  imports: [],
  controllers: [CostCenterController],
  providers: [CostCenterService, CostCenterRepository],
  exports: [CostCenterRepository],
})
export class CostCenterModule {}
