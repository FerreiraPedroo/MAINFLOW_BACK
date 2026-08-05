import { Module } from "@nestjs/common";
import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";

import { ProjectModule } from "@/modules/facilities/projects/project.module";

import { ProcurementController } from "./procurement.controller";

import { ProcurementService } from "./services/procurements.service";
import { ProcurementItemService } from "./procurements-item.service";

import {
  ProcurementItemRepository,
  ProcurementRepository,
} from "./repositories";

@Module({
  imports: [LocalStorageContextModule, ProjectModule],
  controllers: [ProcurementController],
  providers: [
    ProcurementService,
    ProcurementItemService,
    ProcurementRepository,
    ProcurementItemRepository,
  ],
})
export class ProcurementModule {}
