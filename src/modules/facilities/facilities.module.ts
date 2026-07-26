import { Module } from "@nestjs/common";
import { ProjectModule } from "@modules/facilities/projects/project.module";
import { ProcessModule } from "@modules/process/process.module";

@Module({
  imports: [ProjectModule, ProcessModule],
  exports: [ProjectModule],
})
export class FacilitiesModule {}
