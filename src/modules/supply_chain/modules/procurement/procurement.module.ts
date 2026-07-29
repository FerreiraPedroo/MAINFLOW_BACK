import { Module } from "@nestjs/common";
import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";

import { ProjectModule } from "@/modules/facilities/projects/project.module";

import { ProcurementController } from "./procurement.controller";

import { ProcurementService } from "./procurements.service";
import { ProcurementItemService } from "./procurements-item.service";

import { ProcurementPrismaRepository } from "./repositories/procurement.prisma.repository";
import { ProcurementItemPrismaRepository } from "./repositories/procurement-item.prisma.repository";

@Module({
  imports: [LocalStorageContextModule, ProjectModule],
  controllers: [ProcurementController],
  providers: [
    ProcurementService,
    ProcurementItemService,
    {
      provide: "ProcurementRepository",
      useClass: ProcurementPrismaRepository,
    },
    {
      provide: "ProcurementItemRepository",
      useClass: ProcurementItemPrismaRepository,
    },
  ],
})
export class ProcurementModule {}
