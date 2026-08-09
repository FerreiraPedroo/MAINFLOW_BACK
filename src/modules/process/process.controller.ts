import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ProcessService } from "./process.service";
import type { CreateProcessModelRequest } from "./dto/create-process-model-request.dto";
import type { UpdateProcessModelRequest } from "./interfaces/update-process-model-request.interface";
import type { CreateProcessStepModelRequest } from "./interfaces/create-process-step-model-request.interface";

@Controller("admin")
export class ProcessController {
  constructor(private processService: ProcessService) {}

  // // PROCESS
  // @Get("process-models")
  // async findAllProcessModels() {
  //   return await this.processService.findAllProcessModels();
  // }
  // @Post("process-models")
  // async createProcessModel(@Body() request: CreateProcessModelRequest) {
  //   return await this.processService.createProcessModel(request);
  // }
  // @Put("process-models")
  // async updateProcessModel(@Body() request: UpdateProcessModelRequest) {
  //   return await this.processService.updateProcessModel(request);
  // }

  // // PROCESS STEP
  // @Post("process-step-models")
  // async createProcessStepModel(@Body() request: CreateProcessStepModelRequest) {
  //   return await this.processService.createProcessStepModel(request);
  // }
  // @Get("process-step-models/:processStepModelId")
  // async getProcessStepModel(
  //   @Param("processStepModelId") processStepModelId: number,
  // ) {
  //   return await this.processService.getProcessStepModel(processStepModelId);
  // }
}
