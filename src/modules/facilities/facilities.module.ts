import { Module } from "@nestjs/common";
import { ProjectsModule } from "./projects/projects.module.js";

@Module({
  imports: [ProjectsModule],
  exports: [ProjectsModule],
})
export class FacilitiesModule {}
