import { Module } from "@nestjs/common";
import { ProcessController } from "./process.controller";

import { ProcessItemRepository } from "./repository/process-item.repositories";
import { ProcessModelRepository } from "./repository/process-model.repositories";
import { ProcessStepModelRepository } from "./repository/process-step-model.repositories";

import { ProcessService } from "./process.service";

@Module({
  controllers: [ProcessController],
  providers: [
    ProcessModelRepository,
    ProcessStepModelRepository,
    ProcessItemRepository,
    ProcessService,
  ],
  exports: [],
})
export class ProcessModule {}
