import { Module } from "@nestjs/common";

import { DepartmentService } from "./department.service";
import { DepartmentController } from "./department.controller";

import { DepartmentRepository } from "./repositories/department.repository";
import { DepartmentSectorRepository } from "./repositories/department-sector.repository";

@Module({
  imports: [],
  controllers: [DepartmentController],
  providers: [
    DepartmentService,
    DepartmentRepository,
    DepartmentSectorRepository,
  ],
})
export class DepartmentModule {}
