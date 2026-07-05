import { Module } from "@nestjs/common";

import { DepartmentService } from "./department.service";
import { DepartmentController } from "./department.controller";

import { DepartmentRepository } from "./repositories/department.repository";
import { UserDepartmentSectorRepository } from "./repositories/department-sector.repository";
import { AlsModule } from "@/common/context/als-context.module";

@Module({
  imports: [AlsModule],
  controllers: [DepartmentController],
  providers: [
    DepartmentService,
    DepartmentRepository,
    UserDepartmentSectorRepository,
  ],
  exports: [DepartmentService],
})
export class DepartmentModule {}
