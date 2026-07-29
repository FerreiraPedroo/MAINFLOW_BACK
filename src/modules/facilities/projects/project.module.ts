import { Module } from "@nestjs/common";

import { ManagerModule } from "@modules/manager/manager.module";
import { LocalStorageContextModule } from "@common/context/local-storage-context.module";

import { ProjectController } from "./project.controller";

import { ProjectAllocationService } from "./project-allocation.service";
import { ProjectService } from "./project.service";

import { ProjectAllocationRepository, ProjectRepository } from "./repository";

@Module({
  imports: [ManagerModule, LocalStorageContextModule],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    ProjectRepository,
    ProjectAllocationService,
    ProjectAllocationRepository,
  ],
  exports: [ProjectService],
})
export class ProjectModule {}
