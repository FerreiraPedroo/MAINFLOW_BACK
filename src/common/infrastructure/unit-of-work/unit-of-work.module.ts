import { Global, Module } from "@nestjs/common";
import { UnitOfWorkService } from "./unit-of-work.infrastructure";
import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";

@Global()
@Module({
  imports: [LocalStorageContextModule],
  providers: [UnitOfWorkService],
  exports: [UnitOfWorkService],
})
export class UnitOfWorkModule {}
