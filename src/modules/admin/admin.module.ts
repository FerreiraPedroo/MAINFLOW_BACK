import { Module } from "@nestjs/common";

import { LocalStorageContextModule } from "@common/context/local-storage-context.module";

import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { AdminRepository } from "./repositories/admin.repository";

@Module({
  imports: [LocalStorageContextModule],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
})
export class AdminModule {}
