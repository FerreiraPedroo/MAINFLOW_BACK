import { Module } from "@nestjs/common";
import { ProjectsModule } from "./projects/projects.module.js";
import { ProcessModule } from "../process/process.module.js";

@Module({
  imports: [ProjectsModule, ProcessModule],
  exports: [ProjectsModule],
})
export class FacilitiesModule {}
