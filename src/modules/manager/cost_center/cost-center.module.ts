import { Module } from "@nestjs/common";

import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";

import { CostCenterService } from "./cost-center.service";

import { CostCenterRepository } from "./repositories/cost-center.repository";
import { CostCenterController } from "./cost-center.controller";

@Module({
  imports: [LocalStorageContextModule],
  controllers: [CostCenterController],
  providers: [CostCenterService, CostCenterRepository],
  exports: [CostCenterRepository],
})
export class CostCenterModule {}
