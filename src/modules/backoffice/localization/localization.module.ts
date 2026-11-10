import { Module } from "@nestjs/common";
import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";

import { Localizationcontroller } from "./localization.controller";

import { LocalizationService } from "./localization.service";

import { BlockRepository } from "./repository/block.repository";
import { FloorRepository } from "./repository/floor.repository";
import { SpaceTypeRepository } from "./repository/space-type.repository";
import { LocalizationRepository } from "./repository/localization.repository";
import { RoomRepository } from "./repository";

@Module({
  imports: [LocalStorageContextModule],
  controllers: [Localizationcontroller],
  providers: [
    LocalizationService,
    LocalizationRepository,
    RoomRepository,
    BlockRepository,
    FloorRepository,
    SpaceTypeRepository,
  ],
})
export class LocalizationModule {}
