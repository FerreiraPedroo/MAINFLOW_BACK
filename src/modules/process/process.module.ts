import { Module } from "@nestjs/common";
import { ProcessController } from "./process.controller";

import { ProcessModelRepository } from "./interfaces/process-model.repositories";

import { ProcessService } from "./process.service";

@Module({
  controllers: [ProcessController],
  providers: [ProcessModelRepository, ProcessService],
  exports: [],
})
export class ProcessModule {}
