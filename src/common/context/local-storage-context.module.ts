import { Module } from "@nestjs/common";
import { LocalStorageContextService } from "./local-storage-context.service";

@Module({
  providers: [LocalStorageContextService],
  exports: [LocalStorageContextService],
})
export class LocalStorageContextModule {}
