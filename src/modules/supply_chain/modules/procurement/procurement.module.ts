import { Module } from "@nestjs/common";
import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";

import { ProcurementController } from "./procurement.controller";

import { ProcurementService } from "./procurements.service";

import { ProcurementRepository } from "./repositories/procurement.repository";

@Module({
  imports: [LocalStorageContextModule],
  controllers: [ProcurementController],
  providers: [ProcurementService, ProcurementRepository],
})
export class ProcurementModule {}
