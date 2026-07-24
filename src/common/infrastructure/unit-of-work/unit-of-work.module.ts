import { Global, Module } from "@nestjs/common";
import { PrismaUnitOfWork } from "./unit-of-work.infrastructure";
import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";

@Global()
@Module({
  imports: [LocalStorageContextModule],
  providers: [PrismaUnitOfWork],
  exports: [PrismaUnitOfWork],
})
export class UnitOfWorkModule {}
