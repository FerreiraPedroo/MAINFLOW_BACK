import { Module } from "@nestjs/common";
import { Localizationcontroller } from "./localization.controller";
import { LocalizationService } from "./localization.service";
import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";
import { BlockRepository } from "./repository/block.repository";

@Module({
  imports: [LocalStorageContextModule],
  controllers: [Localizationcontroller],
  providers: [LocalizationService, BlockRepository],
})
export class LocalizationModule {}
