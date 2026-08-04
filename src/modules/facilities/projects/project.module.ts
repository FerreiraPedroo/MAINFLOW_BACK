import { Module } from "@nestjs/common";

import { FileModule } from "@/common/modules/file/file.module";
import { ManagerModule } from "@modules/manager/manager.module";
import { LocalStorageContextModule } from "@common/context/local-storage-context.module";

import { ProjectController } from "./project.controller";

import { ProjectAllocationService } from "./project-allocation.service";
import { ProjectService } from "./project.service";

import { ProjectAllocationRepository, ProjectRepository } from "./repository";
import { ProjectDocumentRepository } from "./repository/project-document.repository";

@Module({
  imports: [ManagerModule, FileModule, LocalStorageContextModule],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    ProjectRepository,
    ProjectAllocationService,
    ProjectAllocationRepository,
    ProjectDocumentRepository,
  ],
  exports: [ProjectService],
})
export class ProjectModule {}
