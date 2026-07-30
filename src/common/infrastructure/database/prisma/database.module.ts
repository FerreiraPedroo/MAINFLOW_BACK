import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { DatabaseService } from "./database.service";
import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";

@Global()
@Module({
  imports: [LocalStorageContextModule],
  providers: [PrismaService, DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
