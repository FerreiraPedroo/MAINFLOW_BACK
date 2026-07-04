import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminRepository } from "./repositories/admin.repository";
import { AdminController } from "./admin.controller";
import { ManagerModule } from "../manager/manager.module";

@Module({
  imports: [ManagerModule],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
})
export class AdminModule {}
