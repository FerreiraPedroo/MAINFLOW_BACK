import { Module } from "@nestjs/common";

import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";
import { PrismaService } from "@/common/infrastructure/database/prisma/prisma.service";
import { ProjectModule } from "@/modules/facilities/projects/project.module";

import { ProcurementController } from "./procurement.controller";

import { ProcurementItemService, ProcurementService } from "./services";

import {
  ProcurementItemRepository,
  ProcurementRepository,
} from "./infrastructure/repositories";


@Module({
  imports: [LocalStorageContextModule, ProjectModule],
  controllers: [ProcurementController],
  providers: [
    PrismaService,
    ProcurementRepository,
    ProcurementService,
    ProcurementItemService,
    ProcurementRepository,
    ProcurementItemRepository,
  ],
})
export class ProcurementModule {}
