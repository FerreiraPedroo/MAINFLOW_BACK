import { Module } from "@nestjs/common";
import { ProcessController } from "./process.controller";

import { ActivityRepository } from "./repository/activity.repositories";
import { ProcessModelRepository } from "./repository/process-model.repositories";
import { ProcessStepModelRepository } from "./repository/process-step-model.repositories";

import { ProcessService } from "./process.service";

@Module({
  controllers: [ProcessController],
  providers: [
    ActivityRepository,
    ProcessModelRepository,
    ProcessStepModelRepository,
    ProcessService,
  ],
  exports: [ProcessService],
})
export class ProcessModule {}
