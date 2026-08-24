import { Module } from "@nestjs/common";
import { MaintenanceController } from "./maintenance.controller";
import { MaintenanceService } from "./maintenance.service";
import { MaintenanceRepository } from "./repository/maintenance.repository";

import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";

@Module({
  imports: [LocalStorageContextModule],
  controllers: [MaintenanceController],
  providers: [MaintenanceService, MaintenanceRepository],
  exports: [],
})
export class MaintenanceModule {}
