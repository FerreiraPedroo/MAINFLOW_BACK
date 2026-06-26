import { Module } from "@nestjs/common";
import { CostCenterController } from "./cost-center.controller";
import { CostCenterService } from "./cost-center.service";

@Module({
  imports: [],
  controllers: [CostCenterController],
  providers: [CostCenterService],
})
export class CostCenterModule {}
