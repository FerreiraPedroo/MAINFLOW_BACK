import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminRepository } from "./repositories/admin.repository";
import { AdminController } from "./admin.controller";

@Module({
  imports: [],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
})
export class AdminModule {}
