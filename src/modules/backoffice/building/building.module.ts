import { Module } from "@nestjs/common";
import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";

import { BuildingService } from "./building.service";
import { Buildingcontroller } from "./building.controller";
import { BuildingRepository } from "./repository/building.repository";

@Module({
  imports: [LocalStorageContextModule],
  controllers: [Buildingcontroller],
  providers: [BuildingService, BuildingRepository],
})
export class BuildingModule {}
