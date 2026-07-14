import { Module } from "@nestjs/common";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";
import { ProjectRepository } from "./repository/project.repository";
import { ManagerModule } from "@modules/manager/manager.module";
import { LocalStorageContextModule } from "@common/context/local-storage-context.module";

@Module({
  imports: [ManagerModule, LocalStorageContextModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectRepository],
})
export class ProjectsModule {}
