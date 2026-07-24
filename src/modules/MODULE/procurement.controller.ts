import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";

import { ProcurementService } from "./procurements.service";

import type { CreateProcurementRequest } from "./types/dto/create-procurement.request.dto";
import { UpdateProcurementRequest } from "./types/dto/procurement.request.dto";

@Controller("/supply-chain/procurements")
export class ProcurementController {
  constructor(private procurementService: ProcurementService) {}

  @Get(":procurementId")
  async getProcurement(@Param("procurementId") procurementId: number) {
    return await this.procurementService.getProcurement(procurementId);
  }
  @Get("")
  async findProcurement() {
    return await this.procurementService.findProcurements();
  }
  @Post()
  async createProcurement(@Body() request: CreateProcurementRequest) {
    return await this.procurementService.createProcurement(request);
  }
  @Put(":procurementId")
  async updateProcurement(
    @Param("procurementId") procurementId: number,
    @Body() request: UpdateProcurementRequest,
  ) {
    return await this.procurementService.updateProcurement(
      procurementId,
      request,
    );
  }
}
