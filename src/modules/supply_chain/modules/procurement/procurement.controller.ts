import { Body, Controller, Get, Post } from "@nestjs/common";

import { ProcurementService } from "./procurements.service";

import type { CreateProcurementRequest } from "./types/dto/create-procurement.request.dto";

@Controller("/supply-chain/procurements")
export class ProcurementController {
  constructor(private procurementService: ProcurementService) {}

  @Get()
  async findProcurements() {
    return await this.procurementService.findProcurements();
  }
  @Post()
  async createProcurement(@Body() request: CreateProcurementRequest) {
    return await this.procurementService.createProcurement(request);
  }
}
