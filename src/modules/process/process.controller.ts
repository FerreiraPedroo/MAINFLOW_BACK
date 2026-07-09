import { Body, Controller, Get, Post } from "@nestjs/common";
import { ProcessService } from "./process.service";
import type { CreateProcessModelRequest } from "./dto/create-process-model-request.dto";

@Controller("admin")
export class ProcessController {
  constructor(private processService: ProcessService) {}

  @Get("process-models")
  async findAllProcessModels() {
    return await this.processService.findAllProcessModels();
  }
  @Post("process-models")
  async createProcessModel(@Body() request: CreateProcessModelRequest) {
    return await this.processService.createProcessModel(request);
  }
}
