import { Module } from "@nestjs/common";

import { ProcessModule } from "@modules/process/process.module";
import { ProjectModule } from "@modules/facilities/projects/project.module";
import { MaintenanceModule } from "@modules/facilities/maintenace/maintenance.module";

@Module({
  imports: [ProjectModule, MaintenanceModule, ProcessModule],
  exports: [ProjectModule, MaintenanceModule],
})
export class FacilitiesModule {}
