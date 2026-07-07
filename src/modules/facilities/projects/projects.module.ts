import { Module } from "@nestjs/common";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service.js";
import { ProjectRepository } from "./repository/project.repository";
import { ManagerModule } from "@/modules/manager/manager.module";

@Module({
  imports: [ManagerModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectRepository],
})
export class ProjectsModule {}
